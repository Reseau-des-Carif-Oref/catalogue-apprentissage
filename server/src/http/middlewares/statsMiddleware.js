const config = require("config");
const logger = require("../../common/logger");
const { ApiStat } = require("../../common/model");

const EXCLUDED_PATH_SUFFIXES = ["/docs", "/schema.json"];

const isExcluded = (path) => {
  if (!path) {
    return true;
  }
  if (path === "/api") {
    return true;
  }
  return EXCLUDED_PATH_SUFFIXES.some((suffix) => path.includes(suffix));
};

const normalizeEndpoint = (req) => {
  const raw = req.route ? `${req.baseUrl}${req.route.path}` : (req.originalUrl || req.url || "").split("?")[0];
  return raw.replace(/^\/api\/v1(?=\/|$)/, "/api");
};

const getClientIp = (req) => {
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (xForwardedFor) {
    return xForwardedFor.split(",").shift().trim();
  }
  return req.socket?.remoteAddress || null;
};

const truncateUserAgent = (userAgent) => {
  if (!userAgent) {
    return null;
  }
  return userAgent.length > 255 ? userAgent.slice(0, 255) : userAgent;
};

const isStatsEnabled = () => {
  const enabled = config.stats?.enabled;
  return enabled !== false && enabled !== "false";
};

module.exports = () => {
  return (req, res, next) => {
    if (!isStatsEnabled()) {
      return next();
    }

    const start = process.hrtime.bigint();

    res.on("finish", () => {
      try {
        const endpoint = normalizeEndpoint(req);

        if (isExcluded(endpoint)) {
          return;
        }

        const duree_ms = Number(process.hrtime.bigint() - start) / 1e6;

        ApiStat.create({
          date_appel: new Date(),
          consommateur: req.user?.email || null,
          methode: req.method,
          endpoint,
          code_http: res.statusCode,
          duree_ms: Math.round(duree_ms),
          ip_client: getClientIp(req),
          user_agent: truncateUserAgent(req.headers["user-agent"]),
        }).catch((error) => {
          logger.error(error, "Error while collecting api stats.");
        });
      } catch (error) {
        logger.error(error, "Error while collecting api stats.");
      }
    });

    next();
  };
};
