import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useMoralis } from "react-moralis";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Account from "components/Account/Account";
import Chains from "components/Chains";
import Home from "components/Home";
import Profile from "components/Profile";
import NFT from "components/NFT";
import Support from "components/Support";
import Mint from "components/Mint";
import Error404 from "components/Error404";

import Dashboard from "components/Dashboard";

import ERC20Balance from "components/ERC20Balance";
import ERC20Transfers from "components/ERC20Transfers";
import NFTBalance from "components/NFTBalance";
import Wallet from "components/Wallet";
import { Layout } from "antd";
import NativeBalance from "components/NativeBalance";

import Contract from "components/Contract/Contract";
import MenuItems from "./components/MenuItems";
const { Footer } = Layout;

// eslint-disable-next-line
const App = ({ isServerInfo }) => {
  // console.log("isServerInfo", isServerInfo);

  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3({ provider: connectorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout
      style={{ minHeight: "100vh", filter: "hue-rotate(93deg)" }}
      className="bg-black text-white overflow-hidden "
    >
      <Router>
        <div className="container">
          <nav
            style={{
              zIndex: "1",
              background: "linear-gradient(#ffc10788, #000000)",
            }}
            className="navbar navbar-expand-lg navbar-light mb-5 p-4 rounded"
          >
            <div className="container d-flex justify-content-center">
              <Link className="btn navbar-brand fw-bold bg-warning" to="/">
                🧠 NeuralNFTs
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <MenuItems />

                <Chains />
                <NativeBalance />
                <Account />
              </div>
            </div>
          </nav>
        </div>

        <div className="container">
          <Switch>
            <Route path="/nft">
              <NFT />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/contract">
              <Contract />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/support">
              <Support />
            </Route>
            <Route path="/mint">
              <Mint />
            </Route>

            <Route path="/wallet">
              <Wallet />
            </Route>

            <Route path="/erc20balance">
              <ERC20Balance />
            </Route>

            <Route path="/erc20transfers">
              <ERC20Transfers />
            </Route>

            <Route path="/nftBalance">
              <NFTBalance />
            </Route>

            <Route path="/nonauthenticated">
              <>Please login using the "Authenticate" button</>
            </Route>

            <Route exact path="/">
              <Home />
            </Route>

            <Route path="*">
              <Error404 />
            </Route>
          </Switch>
        </div>
      </Router>
      <Footer className="bg-black text-white mt-5 px-4 container text-end">
        <p>
          Made with ❤️ <br /> by{" "}
          <a
            className="fw-bold text-decoration-none"
            href="https://twitter.com/fabianferno"
          >
            @fabianferno
          </a>{" "}
          &{" "}
          <a
            href="https://twitter.com/gabrielaxyeth"
            className="fw-bold text-decoration-none"
          >
            @gabrielaxy
          </a>
        </p>
      </Footer>
    </Layout>
  );
};

export const Logo = () => (
  <div className="bg-dark px-4" style={{ display: "flex" }}>
    <Link className="navbar-brand fw-bold text-white mx-2" to="/">
      NeuralNFTs
    </Link>
  </div>
);

export default App;
