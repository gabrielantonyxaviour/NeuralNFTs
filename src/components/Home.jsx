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
        <div className="d-block d-md-flex justify-content-start align-items-center ">
          <motion.div
            className="me-4"
            animate={{ x: [1, -15, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <img
              height={650}
              src="https://media3.giphy.com/media/XECtl1Fa2k8IKU2987/giphy.gif?cid=ecf05e47wxgnz6wr2l56xxigi0c3nfday9ejv8x934q19xn9&rid=giphy.gif&ct=s"
              alt=""
            />
          </motion.div>
          <div className="text-white text-start col-12 col-md-9 ps-3">
            <h1 className="fw-bold text-white " style={{ fontSize: "5em" }}>
              NeuralNFTs
            </h1>

            <h2 className="mt-3 pb-2 text-white w-75">
              Giving the sixth sense to NFTs
            </h2>
            <h5 className="text-secondary fw-light w-75">
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

        <h5 className="py-5 text-end mt-5 mb-3 text-white">Powered by</h5>
        <div className="d-flex justify-content-end align-items-center mb-5 pb-5">
          <img
            className="mx-2"
            height="100px"
            src="https://cryptologos.cc/logos/polygon-matic-logo.png"
            alt="Polygon"
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
            alt=""
          />
        </div>

        <div className="d-md-flex align-items-center justify-content-center my-5 container">
          <div className="col-md-4 mx-md-5">
            <img
              src="https://media3.giphy.com/media/QsOq3W7wCoa0sC2QEN/giphy.gif?cid=ecf05e47vw37g2a9n4oymaagriqb2ongpm9kz137qwk47b3l&rid=giphy.gif&ct=s"
              height={400}
              alt=""
              srcSet=""
            />
          </div>
          <div className="col-md-7 mt-5 mt-md-0">
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
