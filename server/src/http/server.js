const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const config = require("config");
const logger = require("../common/logger");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const logMiddleware = require("./middlewares/logMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
const tryCatch = require("./middlewares/tryCatchMiddleware");
const corsMiddleware = require("./middlewares/corsMiddleware");
const permissionsMiddleware = require("./middlewares/permissionsMiddleware");
const packageJson = require("../../package.json");
const formation = require("./routes/formation");
const report = require("./routes/report");
const auth = require("./routes/auth");
const authSecure = require("./routes/authSecure");
const user = require("./routes/user");
const role = require("./routes/role");
const password = require("./routes/password");
const stats = require("./routes/stats");
const esSearch = require("./routes/esSearch");
const esMultiSearchNoIndex = require("./routes/esMultiSearchNoIndex");
const etablissement = require("./routes/etablissement");
const upload = require("./routes/upload");
const alert = require("./routes/alert");
const swaggerSchema = require("../common/model/swaggerSchema");
const rateLimit = require("express-rate-limit");
const authMiddleware = require("./middlewares/authMiddleware");

require("../common/passport-config");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Catalogue apprentissage",
      version: "1.0.1",
      description: `Vous trouverez ici la définition de l'api catalogue apprentissage<br/><br/>
      <img src="https://www.intercariforef.org/sites/default/files/logo-rco.png" />
      <h3><strong>${config.publicUrl}/api/v1</strong></h3><br/>
      Bienvenue sur l'API du <strong>Catalogue national des offres de formation en apprentissage</strong>, géré par le <a href="https://www.intercariforef.org/">Réseau des Carif-Oref</a>.<br />
La collecte de l'offre de formation en apprentissage est une mission confiée par décret au <a href="https://www.intercariforef.org/referencer-son-offre-de-formation">Carif-Oref</a> de chaque territoire. La présente API met à disposition l'ensemble des offres collectées en France métropolitaine et dans les Outre-Mer.<br />
L'API est composée de deux catalogues :<br />
&#x2014; celui des formations;<br />
&#x2014; celui des établissements de formation en apprentissage ayant déclaré une formation en apprentissage auprès d'un Carif-Oref.<br /><br />
La documentation de chaque appel est disponible en bas de la page dans la partie « Schéma ».<br />

      Contact:
      `,
      contact: {
        name: "RCO",
        url: "https://www.intercariforef.org",
        email: "pole-apprentissage@intercariforef.org",
      },
    },
    servers: [
      {
        url: `${config.publicUrl}/api/v1`,
      },
    ],
  },
  apis: ["./src/http/routes/*.js"],
};

const swaggerSpecification = swaggerJsdoc(options);

swaggerSpecification.components = {
  schemas: swaggerSchema,
  securitySchemes: {
    cookieAuth: {
      type: "apiKey",
      in: "cookie",
      name: "connect.sid",
    },
  },
};

module.exports = async (components, verbose = true) => {
  const { db } = components;
  const app = express();

  app.use(bodyParser.json({ limit: "50mb" }));
  // Parse the ndjson as text for ES proxy
  app.use(bodyParser.text({ type: "application/x-ndjson" }));

  app.use(corsMiddleware());
  verbose && app.use(logMiddleware());

  if (config.env != "dev") {
    app.set("trust proxy", 1);
  }

  app.use(
    session({
      saveUninitialized: false,
      resave: true,
      secret: config.auth.secret,
      // https://github.com/jdesboeufs/connect-mongo/blob/HEAD/MIGRATION_V4.md
      store: MongoStore.create({ client: db.getClient() }),
      cookie: {
        secure: config.env === "dev" ? false : true,
        maxAge: config.env === "dev" ? null : 30 * 24 * 60 * 60 * 1000,
        sameSite: "strict", // prevent csrf attack @see https://auth0.com/blog/cross-site-request-forgery-csrf/
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const apiLimiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 25, // 25 calls per IP per second
  });

  const elasticLimiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 100, // 100 calls per IP per second
  });

  const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 calls per minute
    message: "Too many calls from this IP, please try again after one minute",
  });

  const prefixes = ["/api", "/api/v1"];

  const routes = [
    ["/docs", apiLimiter, swaggerUi.serve, swaggerUi.setup(swaggerSpecification)],
    [
      "/schema.json",
      apiLimiter,
      tryCatch(async (req, res) => {
        return res.json(swaggerSpecification);
      }),
    ],
    ["/auth", authLimiter, authSecure(components)],
    ["/auth", apiLimiter, auth(components)],
    ["/password", authLimiter, password(components)],

    ["/es/search", elasticLimiter, esSearch()],
    ["/search", elasticLimiter, esMultiSearchNoIndex()],
    ["/entity", apiLimiter, formation()],
    ["/entity", apiLimiter, report()],
    ["/entity", apiLimiter, etablissement(components)],
    ["/entity", apiLimiter, alert()],
    ["/stats", apiLimiter, stats(components)],
  ];

  const securedRoutes = [
    [
      "/admin",
      apiLimiter,
      authMiddleware,
      permissionsMiddleware({ isAdmin: true }, ["page_gestion_utilisateurs"]),
      user(components),
    ],
    [
      "/admin",
      apiLimiter,
      authMiddleware,
      permissionsMiddleware({ isAdmin: true }, ["page_gestion_utilisateurs", "page_gestion_roles"]),
      role(components),
    ],
    ["/upload", apiLimiter, authMiddleware, permissionsMiddleware({ isAdmin: true }, ["page_upload"]), upload()],
  ];

  prefixes.map((prefix) => {
    [...routes, ...securedRoutes].map((route) => {
      const [path, ...rest] = route;
      app.use(`${prefix}${path}`, ...rest);
    });
  });

  app.get(
    "/api",
    apiLimiter,
    tryCatch(async (req, res) => {
      verbose && logger.info("/api called - healthcheck");

      let mongodbStatus;
      try {
        await db.collection("rcoformation").stats();
        mongodbStatus = true;
      } catch (e) {
        mongodbStatus = false;
        logger.error("Healthcheck failed", e);
      }

      return res.json({
        name: `Serveur Express Catalogue - ${config.appName}`,
        version: packageJson.version,
        env: config.env,
        healthcheck: {
          mongodb: mongodbStatus,
        },
      });
    })
  );

  // app.get(
  //   "/api/config",
  //   tryCatch(async (req, res) => {
  //     return res.json({
  //       config: config,
  //     });
  //   })
  // );

  app.use(errorMiddleware());

  return app;
};
