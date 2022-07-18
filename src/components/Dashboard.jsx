import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import axios from "axios";
import { useMoralis } from "react-moralis";
import { motion, AnimatePresence } from "framer-motion";

function Message() {
  const { isAuthenticated, user } = useMoralis(); // eslint-disable-line

  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  function GithubCard(props) {
    console.log(props);

    return (
      <a
        className="d-flex align-items-center rounded justify-content-center"
        href={props.src}
        target="_blank"
        rel="noreferrer"
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
              : { scale: 1.08 }
          }
          className="rounded p-shadow text-primary m-3 d-flex align-items-center"
          style={{
            width: "20em",
          }}
        >
          <div className="card-body d-flex align-content-between bg-dark text-white flex-wrap">
            <h5 className="text-white text-center fw-bold card-title col-12 p-0">
              Token #{props.title || "Super Skywalker"}
            </h5>
            <img
              src={
                props.src ||
                "https://media1.giphy.com/media/VIWbOd3V8yVap4VQLt/giphy.gif?cid=ecf05e47el66l7t6vr83ibahm737l9kp0je8wvyrbb852kl3&rid=giphy.gif&ct=s"
              }
              className="card-img-top"
              style={{ height: "150px", width: "100%", objectFit: "contain" }}
              alt="..."
            />
            <p className="text-center mt-3 card-text text-secondary font-weight-normal col-12 p-0">
              Minted at{" "}
              {props.text
                ? props.text
                : "Some quick example text to build on the card title and make up the bulk of the card's content."}
            </p>
          </div>
        </motion.div>
      </a>
    );
  }

  useEffect(() => {
    axios
      .request({
        method: "GET",
        url: "https://api.nftport.xyz/v0/nfts/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
        params: {
          chain: "ethereum",
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: "ae7af491-c4de-4de0-b08a-c4a938fda265",
        },
      })
      .then(async function (response) {
        let tokens = response.data.nfts.slice(0, 10);
        let tokens_data = [];

        for (let i = 0; i < tokens.length; i++) {
          await axios
            .get(
              `https://api.nftport.xyz/v0/nfts/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/${tokens[i].token_id}`,
              {
                params: {
                  chain: "ethereum",
                  contract: "0x17517F552d14E3ae1b2a8005f594D7916CE6466d",
                },
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "ae7af491-c4de-4de0-b08a-c4a938fda265",
                },
              },
            )
            .then((data) => {
              console.log(data.data.nft);
              tokens_data.push(data.data.nft);
            })
            .catch(async (err) => {
              console.error(err);
              // Wait for a second
              await new Promise((resolve) => setTimeout(resolve, 1000));
              // Try again
              i--;
            });
        }
        setNfts(tokens_data);
        setLoading(false);
        console.log(tokens_data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

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

          {loading && <div>Loading...</div>}
          {!loading && (
            <motion.div
              // style={{ clipPath: "inset( -100vw 0 -100vw  -100vw)" }}
              className="mt-md-1 pt-md-2 pt-3 mt-3"
            >
              <Marquee
                className="projects-marquee"
                direction="right"
                speed={120}
                pauseOnHover
                gradient
                gradientWidth={0}
                gradientColor={[31, 31, 31]}
              >
                {nfts.map((nft, index) => (
                  <GithubCard
                    threed
                    straight
                    key={index}
                    src={nft.cached_file_url}
                    title={nft.token_id}
                    text={nft.mint_date}
                    technologies={nft.metadata.attributes}
                  />
                ))}
              </Marquee>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Message;
