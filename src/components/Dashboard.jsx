import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import axios from "axios";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { motion, AnimatePresence } from "framer-motion";
import ABI from "../contracts/bayc_abi.json";

function Message() {
  const { isAuthenticated, user } = useMoralis(); // eslint-disable-line
  // eslint-disable-next-line
  const [dummy, setDummy] = useState([
    "1N23N",
    "2L2MN",
    "3WKLM",
    "4XLKM3",
    "A223J",
    "ASDAS",
    "A2ASD",
  ]);

  // eslint-disable-next-line
  const { runContractFunction, contractResponse, error, isRunning, isLoading } =
    useWeb3Contract({
      abi: ABI,
      contractAddress: "0x17517F552d14E3ae1b2a8005f594D7916CE6466d",
      functionName: "observe",
      params: {
        secondsAgos: [0, 10],
      },
    });

  function GithubCard(props) {
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
          className="card bg-danger rounded p-shadow text-primary m-3 d-flex align-items-center"
          style={{
            width: "20em",
          }}
        >
          <div className="card-body d-flex align-content-between bg-black text-white flex-wrap">
            <h5 className="text-white fw-bold card-title col-12 p-0">
              {props.title ? props.title : "Super Skywalker"}
            </h5>
            <img
              src="https://media1.giphy.com/media/VIWbOd3V8yVap4VQLt/giphy.gif?cid=ecf05e47el66l7t6vr83ibahm737l9kp0je8wvyrbb852kl3&rid=giphy.gif&ct=s"
              className="card-img-top"
              style={{ height: "150px", width: "100%", objectFit: "none" }}
              alt="..."
            />
            <p className="mt-3 card-text text-secondary font-weight-normal col-12 p-0">
              This model can be used to predict the price of a stock.
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
        url: "https://api.nftport.xyz/v0/nfts/0x17517F552d14E3ae1b2a8005f594D7916CE6466d",
        params: {
          chain: "ethereum",
          contract: "0x17517F552d14E3ae1b2a8005f594D7916CE6466d",
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: "ae7af491-c4de-4de0-b08a-c4a938fda265",
        },
      })
      .then(function (response) {
        console.log(response.data);
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
          {/* Profile Section */}

          <div
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1450&h=350&q=80)",
            }}
            className="rounded row pt-5"
          >
            <div
              style={{ background: "#000000aa" }}
              className="mt-5 d-flex align-items-end justify-content-start"
            >
              <img
                style={{
                  width: "150px",
                }}
                src="https://64.media.tumblr.com/73354947f7e524a5cdadaec2ef77fc41/709a1397f7446f1d-65/s400x600/16e5a7bae6da4bb72ffe3b180de9b3b90f417bb7.png"
                alt=""
              />
              <div className="ms-3 mt-2 text-white text-start">
                <h1 className="fw-bold text-white ">Fabian Ferno</h1>
                <p className="h5">
                  <span className="text-warning">📍Argentina</span> | I am a
                  software developer and I love to learn new things.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 justify-content-end">
            <h3 className="fw-bold text-white">Listings</h3>
          </div>
          <h5 className="mb-3 text-secondary">
            ↩️ Select a NeuralNFT🧠 to use the model
          </h5>

          <motion.div
            style={{ clipPath: "inset( -100vw 0 -100vw  -100vw)" }}
            className="bg-dark mt-md-1 pt-md-2 pt-3 mt-3"
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
              {dummy.concat(dummy).map((project, index) => (
                <GithubCard
                  threed
                  straight
                  key={index}
                  src={project}
                  title={project}
                  text={project}
                  technologies={project}
                />
              ))}
            </Marquee>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Message;
