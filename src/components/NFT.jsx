import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import { getEllipsisTxt } from "helpers/formatters";
// eslint-disable-next-line
import { useMoralis } from "react-moralis";

// eslint-disable-next-line
import axios from "axios";

function NFT() {
  const queryParams = new URLSearchParams(window.location.search);
  const token_id = queryParams.get("token_id");
  const contract_address = queryParams.get("contract_address");

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nftData, setNftData] = useState({});

  const { isAuthenticated, Moralis } = useMoralis();

  const ethers = Moralis.web3Library;
  const provider = ethers.getDefaultProvider();

  useEffect(() => {
    if (isAuthenticated) {
      // add your logic here
      (async () => {
        let covalent_transactions =
          await Moralis.Plugins.covalent.getNftTransactionsForContract({
            chainId: 80001,
            contractAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
            tokenId: "203",
          });

        setTransactions(covalent_transactions.data.items[0].nft_transactions);

        await Moralis.Plugins.covalent
          .getNftExternalMetadataForContract({
            chainId: 80001,
            contractAddress: contract_address,
            tokenId: token_id,
          })
          .then(async (data) => {
            let more_data = await axios.get(
              data.data.items[0].nft_data[0].token_url,
            );
            var name = await provider.lookupAddress(
              data.data.items[0].nft_data[0].original_owner, // eslint-disable-line
            );
            console.log(data.data.items[0].nft_data[0]);
            console.log(name);
            setNftData({ ...data.data.items[0], ...more_data.data });
            setLoading(false);
            console.log(nftData);
          })
          .catch(async (err) => {
            console.log(err);
            throw err;
          });
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div className="text-white mt-5">
      <h1 className="fw-bold mb-5 text-white text-end">
        ⬅️ Use the NeuralNFT{" "}
      </h1>
      {!loading && nftData && (
        <div className="card card-body bg-dark p-4">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="text-white text-start fw-bold pb-3">
              {nftData.name}{" "}
              <span className="text-secondary">{nftData.contract_name}</span>
            </h3>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="col-3">
              <img
                src={
                  nftData.nft_data[0].external_data.image_256 ||
                  "https://media1.giphy.com/media/VIWbOd3V8yVap4VQLt/giphy.gif?cid=ecf05e47el66l7t6vr83ibahm737l9kp0je8wvyrbb852kl3&rid=giphy.gif&ct=s"
                }
                alt="..."
              />
            </div>
            <div className="col-9">
              <div className="d-flex mb-3">
                <span className="btn badge bg-primary me-2">
                  {nftData.attributes[0].value}
                </span>
                <span className="btn badge bg-primary me-2">
                  {nftData.attributes[1].value}
                </span>
                <span className="btn badge bg-primary me-2">
                  {nftData.attributes[2].value}
                </span>
              </div>
              <h4 className="text-white">{nftData.short_description}</h4>
              <p className="text-secondary">{nftData.long_description}</p>
              <a
                href={nftData.model}
                className="btn btn-sm rounded btn-light shadow fw-bold mt-2 me-2"
              >
                Download Model ⬇️
              </a>
              <a
                href={nftData.model}
                className="btn btn-sm rounded bg-secondary text-light shadow fw-bold mt-2 me-2"
              >
                {getEllipsisTxt(nftData.nft_data[0].original_owner, 6)} 🔗
              </a>
              <a
                href={nftData.model}
                className="btn btn-sm rounded bg-secondary text-light shadow fw-bold mt-2 me-2"
              >
                GitHub 🌐
              </a>
            </div>
          </div>
        </div>
      )}

      {loading && <ProjectLoader />}
      {transactions.length > 0 && !loading && (
        <section className="text-white my-5 ">
          <h4 className="fw-bold text-white text-end">Transactions</h4>
          <p className="text-end">
            Powered by <span className="fw-bold text-danger">CovalentHQ</span>
          </p>
          <motion.div className="mt-md-1 pt-md-2 pt-3 mt-3">
            <Marquee
              className=" "
              direction="right"
              speed={120}
              pauseOnHover
              gradient
              gradientWidth={0}
              gradientColor={[31, 31, 31]}
            >
              {transactions.map((item, index) => (
                <TransactionCard key={index} item={item} />
              ))}
            </Marquee>
          </motion.div>
        </section>
      )}
    </div>
  );
}

function TransactionCard(props) {
  return (
    <div className="d-flex align-items-center rounded justify-content-center">
      <motion.div
        whileHover={
          props.threed
            ? {
                y: 10,
                x: 10,
                filter: "invert(1) hue-rotate(20deg)",
              }
            : { scale: 1.08 }
        }
        className="rounded p-shadow text-primary m-3 d-flex align-items-center"
        style={{
          width: "20em",
        }}
      >
        <div className="card-body d-flex align-content-between bg-dark text-white flex-wrap">
          <p className="text-secondary col-12 p-0">
            <span className="text-success">#{props.item.block_height}</span> |{" "}
            {props.item.block_signed_at || "Super Skywalker"}
          </p>
          <div className="col-12 mt-2">
            From:
            <div className="btn text-white fw-bold d-flex p-0">
              {getEllipsisTxt(props.item.from_address, 6) || "0x000...000"}
            </div>
          </div>{" "}
          <br />
          <div className="col-12 mt-2">
            To:
            <div className="btn text-white fw-bold d-flex p-0">
              {getEllipsisTxt(props.item.to_address, 6) || "0x000...000"}
            </div>
            {props.item.to_address_label
              ? props.item.to_address_label + " ✓"
              : "Anonymous"}
          </div>{" "}
          <br />
          <div className="col-12 mt-2">
            Value:
            <div className="btn text-white fw-bold d-flex p-0">
              {parseInt(props.item.value) / 10000000000000000000} ETH
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default NFT;

function ProjectLoader() {
  function LoaderCard() {
    return (
      <div className="card  card-body p-shadow bg-black rounded">
        <div className="d-flex align-items-center justify-content-center">
          <div className="spinner-grow text-secondary mx-2" role="status"></div>{" "}
          <div className="spinner-grow text-secondary mx-2" role="status"></div>
          <div className="spinner-grow text-secondary mx-2" role="status"></div>
          <div className="spinner-grow text-secondary mx-2" role="status"></div>
          <div className="spinner-grow text-secondary mx-2" role="status"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="mt-5 text-primary d-flex align-items-center justify-content-end text-right"
    >
      <Marquee
        direction="right"
        speed={120}
        pauseOnHover
        gradient
        gradientWidth={0}
        gradientColor={[31, 31, 31]}
      >
        {<LoaderCard />} <LoaderCard /> <LoaderCard />
        <LoaderCard /> <LoaderCard /> <LoaderCard />
      </Marquee>
    </motion.div>
  );
}
