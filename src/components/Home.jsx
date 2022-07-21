import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { motion, AnimatePresence } from "framer-motion";

function Home() {
  const { isAuthenticated, user } = useMoralis();

  useEffect(() => {
    if (isAuthenticated) {
      // add your logic here
      console.dir(user?.attributes.ethAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 20 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 2.5 }}
        className="container mt-5"
      >
        <div className="d-block text-center align-items-center ">
          <div className="mb-5" style={{ zIndex: "0" }}>
            <img
              style={{
                height: "50vh",
                marginTop: "-120px",
                filter: "hue-rotate(10deg)",
                opacity: "0.5",
              }}
              src="https://media3.giphy.com/media/rKyQHomirHn1U4X6uM/giphy.gif?cid=ecf05e47dsskp0rxa0ajeqcprg4lys48gcoeg1tmv0jq0866&rid=giphy.gif&ct=s"
              alt=""
            />
          </div>
          <div
            style={{ marginTop: "-50px", zIndex: "50" }}
            className="text-white text-center "
          >
            <h1
              className="fw-bold text-white "
              style={{
                fontSize: "6em",
                fontFamily: "monospace",
              }}
            >
              Neural<span className="text-warning">NFTs</span>
            </h1>

            <h2 className="mt-3 pb-2 text-white ">
              Giving the sixth sense to NFTs
            </h2>
            <h5 className="text-secondary fw-light px-5 mx-5">
              We are planning to build a ML model NFT marketplace where ML
              artists can showcase their talents by creating interactive NFTs.
              This would be really helpful for people who are starting out in ML
              and also for the veterans to join together as a community and
              create NFTs. People can also buy, sell and auction the NFTs in the
              marketplace. Giving the sixth sense to NFTs by creating an
              interactive ML model marketplace with NFT analytics.
            </h5>
          </div>
        </div>

        <h5 className="py-5 text-center mt-5 mb-3 text-secondary">
          POWERED BY
        </h5>
        <div className="d-flex justify-content-center align-items-center mb-5 pb-5">
          <img
            className="mx-2"
            height="100px"
            src="https://cryptologos.cc/logos/polygon-matic-logo.png"
            alt="Polygon"
          />
          <img
            className="mx-2"
            height="100px"
            src="https://pbs.twimg.com/profile_images/1432723747874684934/N7bJoAi6_400x400.jpg"
            alt="XMTP"
          />
          <img
            className="mx-2"
            height="100px"
            src="https://seeklogo.com/images/W/walletconnect-logo-EE83B50C97-seeklogo.com.png"
            alt="Wallet Connect"
          />
          <img
            className="mx-2"
            height="100px"
            src="https://images.ctfassets.net/q5ulk4bp65r7/1rFQCqoq8hipvVJSKdU3fQ/21ab733af7a8ab404e29b873ffb28348/coinbase-icon2.svg"
            alt="Coinbase"
          />
          <img
            className="mx-2"
            height="100px"
            src="https://cryptologos.cc/logos/the-graph-grt-logo.png"
            alt="TheGraph"
          />
          <img
            className="mx-2"
            height="100px"
            src="https://assets.website-files.com/609ab8eae6dd417c085cc925/609b2ba76d637745d781160e_logo-ceramic.png"
            alt="Ceramic"
          />
          <img
            className="mx-2"
            height="100px"
            src="https://pbs.twimg.com/profile_images/570059057197625344/h4Bvj_8p_400x400.png"
            alt="Filecoin"
          />
          <img
            className="mx-2"
            height="100px"
            src="https://docs.spheron.network/img/favicon.ico"
            alt="Spheron"
          />{" "}
          <img
            className="mx-2"
            height="100px"
            src="https://www.programmableweb.com/sites/default/files/nftport-logo.jpg"
            alt="NFTport"
          />
        </div>

        <div className="d-md-flex align-items-center justify-content-center my-5 container">
          <div className="col-md-4 mx-md-5">
            <img
              src="https://media3.giphy.com/media/QsOq3W7wCoa0sC2QEN/giphy.gif?cid=ecf05e47vw37g2a9n4oymaagriqb2ongpm9kz137qwk47b3l&rid=giphy.gif&ct=s"
              style={{ width: "500px" }}
              alt=""
              srcSet=""
            />
          </div>
          <div className="col-md-7 mt-5 mt-md-0 text-end">
            <h1 className="fw-bold text-white w-75">How to use?</h1>
            <h4 className="text-secondary fw-light w-75">
              A person can use the NeuralNFTs platform to run a ML model which
              is an on-chain component to perform client side processes with the
              model.
            </h4>
          </div>
        </div>

        {/* <div className="d-md-flex align-items-center justify-content-center my-5 container">
          <div className="col-md-6 mt-5 mt-md-0 text-end">
            <h1 className="fw-bold text-white">
              Towards Decentalized Security
            </h1>
            <h4 className="text-secondary fw-light">
              Simply, a device is first minted (registered) on the blockchain
              similar to the NFTs on their smart contract. The mint occurs by
              creating the NeuralNFTs hash based on firmware, metadata, owner
              address and the device identifier. The next time the device tries
              to authenticate using the NeuralNFTs platform, this NeuralNFTs
              hash is compared with the on-chain data and allows further access
              to the IPFS API to transact the sensor data. The admin can use the
              front end dApp to mint, view devices and look at the sensor data
              collected by the NeuralNFTs platform. This is done completely
              decentralized from end to end, meaning there’s no single point of
              failure and hence byzantine fault tolerance is achieved.
            </h4>
          </div>
          <div className="col-md-5 mx-md-5">
            <img
              src="https://media1.giphy.com/media/VIWbOd3V8yVap4VQLt/giphy.gif?cid=ecf05e47el66l7t6vr83ibahm737l9kp0je8wvyrbb852kl3&rid=giphy.gif&ct=s"
              height={300}
              alt=""
              srcSet=""
            />
          </div>
        </div> */}
      </motion.div>
    </AnimatePresence>
  );
}

export default Home;
