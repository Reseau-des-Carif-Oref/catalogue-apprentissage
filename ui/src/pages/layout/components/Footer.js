import React from "react";

import packageJson from "../../../../package.json";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row align-items-center flex-row-reverse">
          <div className="col-auto ml-lg-auto">
            <div className="row align-items-center">
              <div className="col-auto">
                <ul className="list-inline list-inline-dots mb-0">
                  <li className="list-inline-item">
                    <a href="https://mission-apprentissage.gitbook.io/" target="_blank" rel="noopener noreferrer">
                      Documentation
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-auto">
                <a
                  href="https://github.com/mission-apprentissage/catalogue-apprentissage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm"
                >
                  Code source
                </a>
              </div>
              <div className="col-auto">
                <a href="mailto:catalogue@apprentissage.beta.gouv.fr">Contact</a>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-auto mt-3 mt-lg-0 text-center">
            <a href="https://beta.gouv.fr/startups/apprentissage.html" target="_blank" rel="noopener noreferrer">
              Mission Nationale pour l&apos;apprentissage
            </a>{" "}
            - © {`${new Date().getFullYear()}`} - Version {packageJson.version}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
