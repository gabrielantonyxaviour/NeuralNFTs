import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { useMoralis, useChain } from "react-moralis";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const { isAuthenticated, user, Moralis } = useMoralis(); // eslint-disable-line
  const { loading, error, data } = useQuery(gql`
    {
      activeItems(first: 5) {
        id
        buyer
        seller
        tokenId
        price
      }
    }
  `);

  const [metadataLoaded, setMetadataLoaded] = useState(false);
  const [nfts, setNfts] = useState([]);

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

  useEffect(() => {
    if (error) return console.log("Graph Error: ", error);

    if (!loading) {
      (async () => {
        let tokens = data.activeItems;
        console.log("Data from TheGraph: ", tokens);
        let all_tokens_with_data = [];

        for (let i = 0; i < tokens.length; i++) {
          await axios
            .get(
              `https://api.nftport.xyz/v0/nfts/${process.env.REACT_APP_CONTRACT_ADDRESS}/${tokens[i].tokenId}`,
              {
                params: { chain: chain },
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "ae7af491-c4de-4de0-b08a-c4a938fda265",
                },
              },
            )
            .then(async (data) => {
              all_tokens_with_data.push({
                ...data.data.nft,
                price: tokens[i].price,
              });
            })
            .catch(function (error) {
              console.error(error);
            });
        }
        console.log("All Tokens with Data: ", all_tokens_with_data);
        setNfts(all_tokens_with_data);
        setMetadataLoaded(true);
      })();
    }
  }, [data, error, loading, Moralis]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 20 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 2.5 }}
      >
        <div className="text-white mt-5 text-end ">
          <h1 className="fw-bold text-white">Dashboard</h1>
          <div className="mt-4 justify-content-end">
            <h3 className="fw-bold text-white">Listings</h3>
          </div>
          <h5 className="mb-3 text-secondary">
            ↩️ Select a NeuralNFT🧠 to use the model
          </h5>

          {(loading || !metadataLoaded) && <ProjectLoader />}
          {!loading && metadataLoaded && (
            <motion.div className="mt-md-1 pt-md-2 pt-3 mt-3">
              <Marquee
                className="projects-marquee"
                direction="right"
                speed={120}
                pauseOnHover
                gradient
                gradientWidth={0}
                gradientColor={[31, 31, 31]}
              >
                {nfts
                  .concat(nfts)
                  .concat(nfts)
                  .map((nft, index) => (
                    <NFTCard threed straight key={index} nft={nft} />
                  ))}
              </Marquee>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function NFTCard(props) {
  return (
    <Link
      onClick={() => {
        localStorage.setItem("price", props.nft.price);
      }}
      className="d-flex align-items-center rounded justify-content-center"
      to={`/nft?contract_address=${props.nft.contract_address}&token_id=${props.nft.token_id}`}
    >
      <motion.div
        initial={{ rotate: props.straight ? 0 : props.right ? 5 : -5 }}
        whileHover={
          props.threed
            ? {
                y: 10,
                x: 10,
                filter: "invert(1) hue-rotate(20deg)",
              }
            : { scale: 1.02 }
        }
        className="rounded p-shadow text-primary m-3 d-flex align-items-center"
        style={{
          width: "18em",
        }}
      >
        <div className="card-body d-flex align-content-between bg-dark text-white flex-wrap">
          <h5 className="text-white text-start fw-bold card-title col-12 p-0">
            {props.nft.metadata.name || "Super Skywalker"}
          </h5>
          <img
            src={
              props.nft.file_url ||
              "https://media1.giphy.com/media/VIWbOd3V8yVap4VQLt/giphy.gif?cid=ecf05e47el66l7t6vr83ibahm737l9kp0je8wvyrbb852kl3&rid=giphy.gif&ct=s"
            }
            className=" "
            style={{ width: "100%", objectFit: "contain" }}
            alt="..."
          />
          <p className="text-start pt-3 ">
            {props.nft.metadata.attributes[3].value}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

export function ProjectLoader() {
  function LoaderCard() {
    return (
      <div className="card mx-3 card-body p-shadow bg-black rounded">
        <div className="d-flex align-items-center justify-content-center">
          <div className="spinner-grow text-secondary mx-2" role="status"></div>{" "}
          <div className="spinner-grow text-secondary mx-2" role="status"></div>
          <div className="spinner-grow text-secondary mx-2" role="status"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="text-primary d-flex align-items-center justify-content-end text-right">
      <Marquee
        className="projects-marquee"
        direction="right"
        speed={600}
        pauseOnHover
        gradient
        gradientWidth={0}
        gradientColor={[31, 31, 31]}
      >
        <LoaderCard /> <LoaderCard /> <LoaderCard />
        <LoaderCard /> <LoaderCard /> <LoaderCard />
      </Marquee>
    </motion.div>
  );
}

export default Dashboard;
