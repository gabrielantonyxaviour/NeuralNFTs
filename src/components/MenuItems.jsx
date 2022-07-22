// import { useLocation } from "react-router";
// import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

function MenuItems() {
  // const { pathname } = useLocation();
  const { isAuthenticated, user } = useMoralis(); // eslint-disable-line

  useEffect(() => {
    if (isAuthenticated) {
      // add your logic here
      // console.dir(user?.attributes.ethAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  function Items() {
    return (
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        {/* <li className="bg-black btn badge btn-sm nav-item mx-2 my-2 my-md-0">
          <NavLink className="nav-link active text-white" to="/">
            Home
          </NavLink>
        </li> */}
        {isAuthenticated && (
          <React.Fragment>
            <li className="bg-black btn badge btn-sm nav-item mx-2 my-2 my-md-0">
              <NavLink className="nav-link active text-white" to="/dashboard">
                Dashboard
              </NavLink>
            </li>
            <li className="bg-black btn badge btn-sm nav-item mx-2 my-2 my-md-0">
              <NavLink className="nav-link active text-white" to="/profile">
                Profile
              </NavLink>
            </li>
            <li className="bg-black btn badge btn-sm nav-item mx-2 my-2 my-md-0">
              <NavLink className="nav-link active text-white" to="/support">
                Support
              </NavLink>
            </li>
          </React.Fragment>
        )}
      </ul>
    );
  }

  return <Items />;
}

export default MenuItems;
