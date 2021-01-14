import React from "react";
import { NavLink } from "react-router-dom";
import { Dropdown, Site } from "tabler-react";
import useAuth from "../../../common/hooks/useAuth";

const NavigationMenu = () => {
  let [auth] = useAuth();

  let dropDownItems = (
    <>
      <Dropdown.Item to="/guide-reglementaire">Guide réglementaire</Dropdown.Item>
      <Dropdown.Item to="/guide-signalements">Guide de signalements</Dropdown.Item>
      {auth?.sub !== "anonymous" && <Dropdown.Item to="/guide-modification">Guide d'utilisation</Dropdown.Item>}
    </>
  );

  return (
    <Site.Nav>
      <div className="header collapse d-lg-flex p-0" id="headerMenuCollapse">
        <div className="container">
          <div className="row row align-items-center">
            <div className="col-lg-3 ml-auto"></div>
            <div className="col col-lg order-lg-first">
              <ul className="nav nav-tabs border-0 flex-column flex-lg-row">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/" exact={true} activeClassName="active">
                    <i className="fe fe-home"></i> Accueil
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/recherche/formations-2021" activeClassName="active">
                    <i className="fe fe-box"></i> Formations 2021
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/recherche/formations-2020" activeClassName="active">
                    <i className="fe fe-box"></i> Formations 2020
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/recherche/etablissements" activeClassName="active">
                    <i className="fe fe-box"></i> Établissements
                  </NavLink>
                </li>
                <li className="nav-item">
                  <Dropdown
                    arrow
                    arrowPosition="right"
                    trigger={
                      <Dropdown.Trigger arrow toggle={false}>
                        Guides
                      </Dropdown.Trigger>
                    }
                    position="bottom"
                    items={dropDownItems}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Site.Nav>
  );
};

export default NavigationMenu;
