import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import { getEllipsisTxt } from "helpers/formatters";
import ABI from "../contracts/NNFT_ABI.json";
// eslint-disable-next-line
import { useMoralis, useWeb3Contract, useChain } from "react-moralis";

// eslint-disable-next-line
import axios from "axios";

function NFT() {
  const queryParams = new URLSearchParams(window.location.search);
  const token_id = queryParams.get("token_id");
  const contract_address = queryParams.get("contract_address");

  const [transactions, setTransactions] = useState([]); // eslint-disable-line
  const [nftLoading, setNftLoading] = useState(true); // eslint-disable-line
  const [nftData, setNftData] = useState({});
  const [isOwner, setIsOwner] = useState(false);

  const { isAuthenticated, Moralis, user } = useMoralis();

  const ethers = Moralis.web3Library;
  const provider = ethers.getDefaultProvider(); // eslint-disable-line

  const { chainId } = useChain();

  let chain;

  switch (parseInt(chainId)) {
    case 137:
      chain = "polygon";
      break;
    case 4:
      chain = "rinkeby";
      break;
    case 80001:
      chain = "mumbai";
      break;
    default:
      chain = "ethereum"; // eslint-disable-line
  }

  const {
    runContractFunction, // eslint-disable-line
    error,
    isLoading,
  } = useWeb3Contract({
    abi: ABI,
    contractAddress: contract_address,
    functionName: "buyItem",
    params: {
      tokenId: token_id,
    },
    msgValue: parseInt(localStorage.getItem("price")),
  });

  async function buyNFT() {
    await runContractFunction();
    if (error) {
      console.error(error);
    } else {
      console.log("Successfully bought NFT");
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      // add your logic here
      (async () => {
        await axios
          .request({
            method: "GET",
            url: `https://api.nftport.xyz/v0/nfts/${contract_address}/${token_id}`,
            params: { chain: chain },
            headers: {
              "Content-Type": "application/json",
              Authorization: "ae7af491-c4de-4de0-b08a-c4a938fda265",
            },
          })
          .then(async (data) => {
            setNftData(data.data.nft);
            setNftLoading(false);
            console.log("Data from NFTPort: ", data.data);

            await axios
              .request({
                method: "GET",
                url: `https://api.nftport.xyz/v0/accounts/${user?.attributes.ethAddress}`,
                params: {
                  chain: "rinkeby",
                  contract_address:
                    "0x094605EB62e5AF67b9b03f51f313C747C4c7dE66",
                },
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "ae7af491-c4de-4de0-b08a-c4a938fda265",
                },
              })
              .then(function (response) {
                // es-lint-disable-next-line
                let ownedNFTs = response.data.nfts
                  .filter((item) => item.contract_address === contract_address)
                  .map((item) => item.token_id);
                console.log("ownedNFTs: ", ownedNFTs);
                ownedNFTs.includes(token_id) && setIsOwner(true);
              })
              .catch(function (error) {
                console.error(error);
              });

            // // eslint-disable-next-line
            // var name = await provider.lookupAddress(
            //   data.data.items[0].nft_data[0].original_owner, // eslint-disable-line
            // );
          })
          .catch(async (err) => {
            console.log(err);
            throw err;
          });

        // let nftPortTransactions = await axios
        //   .request({
        //     method: "GET",
        //     url: `https://api.nftport.xyz/v0/transactions/nfts/${contract_address}/${token_id}`,
        //     params: { chain: chain, type: "all" },
        //     headers: {
        //       "Content-Type": "application/json",
        //       Authorization: "ae7af491-c4de-4de0-b08a-c4a938fda265",
        //     },
        //   })
        //   .then(function (response) {
        //     console.log(response.data);
        //     return response.data;
        //   })
        //   .catch(function (error) {
        //     console.error(error);
        //   });

        // console.log(nftPortTransactions);

        // let covalent_transactions =
        //   await Moralis.Plugins.covalent.getNftTransactionsForContract({
        //     chainId: chainId,
        //     contractAddress:
        //       contract_address || "0x861F4ef6b6dfe5072A10A0bD1Ee1AB678aBED519",
        //     tokenId: token_id || "203",
        //   });

        // setTransactions(covalent_transactions.data.items[0].nft_transactions);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, Moralis, isOwner]);

  return (
    <div className="text-white mt-5">
      <h1 className="fw-bold mb-5 text-white text-end">
        ⬅️ Use the NeuralNFT{" "}
      </h1>
      {!nftLoading && nftData && (
        <div className="card card-body bg-dark p-4">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="text-white text-start fw-bold pb-3">
              #{token_id} {nftData.metadata.name}{" "}
              <span className="text-warning">{`NeuralNFT`}</span>
            </h3>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="col-3">
              <img
                className="rounded-circle"
                src={
                  nftData.cached_file_url ||
                  "https://media1.giphy.com/media/VIWbOd3V8yVap4VQLt/giphy.gif?cid=ecf05e47el66l7t6vr83ibahm737l9kp0je8wvyrbb852kl3&rid=giphy.gif&ct=s"
                }
                style={{ width: "250px", height: "250px" }}
              />
            </div>
            <div className="col-9">
              <div className="d-flex mb-3">
                <span className="btn badge bg-primary me-2">
                  {nftData.metadata.attributes[0].value}
                </span>
                <span className="btn badge bg-primary me-2">
                  {nftData.metadata.attributes[1].value}
                </span>
                <span className="btn badge bg-primary me-2">
                  {nftData.metadata.attributes[2].value}
                </span>
              </div>
              <h5 className="text-white">
                {nftData.metadata.attributes[3].value}
              </h5>
              <p className="text-secondary">
                {nftData.metadata.attributes[4].value}
              </p>
              {isOwner && (
                <a
                  href={nftData.model}
                  className="btn btn-sm rounded btn-light shadow fw-bold mt-2 me-2"
                >
                  Download Model ⬇️
                </a>
              )}{" "}
              {!isOwner && (
                <div
                  disabled={isLoading}
                  onClick={buyNFT}
                  className="btn btn-sm rounded btn-light shadow fw-bold mt-2 me-2"
                >
                  Buy the NeuralNFT 🛒
                </div>
              )}
              <a
                href={`https://rinkeby.etherscan.io/address/${contract_address}/${token_id}`}
                className="btn btn-sm rounded bg-secondary text-light shadow fw-bold mt-2 me-2"
              >
                View in Block Explorer 🔗
              </a>
              <a
                href={nftData.metadata.external_url}
                className="btn btn-sm rounded bg-secondary text-light shadow fw-bold mt-2 me-2"
              >
                GitHub 🌐
              </a>
            </div>
          </div>
        </div>
      )}

      {nftLoading && <ProjectLoader />}
      {transactions.length > 0 && !nftLoading && (
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
          href={`https://rinkeby.etherscan.io/address/${props.item.from_address}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {getEllipsisTxt(props.item.from_address, 6) || "0x000...000"}
        </a>
      </td>
      <td>
        <a
          href={`https://rinkeby.etherscan.io/address/${props.item.to_address}`}
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
