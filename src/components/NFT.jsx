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
            contractAddress:
              contract_address || "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
            tokenId: token_id || "203",
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
            console.log(more_data.data);
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
  }, [isAuthenticated, Moralis]);

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
                href={`https://etherscan.io/address/${nftData.nft_data[0].original_owner}`}
                className="btn btn-sm rounded bg-secondary text-light shadow fw-bold mt-2 me-2"
              >
                {getEllipsisTxt(nftData.nft_data[0].original_owner, 6)} 🔗
              </a>
              <a
                href={nftData.external_url}
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

          <table className="table text-white">
            <thead>
              <tr>
                <th scope="col"># TXN</th>
                <th scope="col">Timestamp</th>
                <th scope="col">From</th>
                <th scope="col">To</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((item, index) => (
                <TransactionRow key={index} item={item} />
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function TransactionRow(props) {
  return (
    <tr className="rounded p-shadow text-warning m-3">
      <th scope="row">{props.item.block_height}</th>
      <td>{props.item.block_signed_at}</td>
      <td>
        <a
          href={`https://etherscan.io/address/${props.item.from_address}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {getEllipsisTxt(props.item.from_address, 6) || "0x000...000"}
        </a>
      </td>
      <td>
        <a
          href={`https://etherscan.io/address/${props.item.to_address}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {getEllipsisTxt(props.item.to_address, 6) || "0x000...000"}{" "}
        </a>
        {props.item.to_address_label
          ? props.item.to_address_label + " ✓"
          : "Anonymous"}
      </td>
      <td>{parseInt(props.item.value) / 10000000000000000000} ETH</td>
    </tr>
  );
}

export default NFT;

function ProjectLoader() {
  function LoaderCard() {
    return (
      <div className="card card-body p-shadow bg-black rounded">
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
    <motion.div className="mt-5 text-primary d-flex align-items-center justify-content-end text-right">
      <Marquee
        direction="right"
        speed={600}
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
