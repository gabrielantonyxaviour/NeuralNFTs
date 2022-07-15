import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import { motion, AnimatePresence } from "framer-motion";

function Message() {
  const { isAuthenticated, user } = useMoralis(); // eslint-disable-line
  const [dummy, setDummy] = useState([
    "1N23N",
    "2L2MN",
    "3WKLM",
    "4XLKM3",
    "A223J",
  ]);

  const [activeNeuralNFT, setActiveNeuralNFT] = useState(dummy[0]);

  const Cards = ({ data, title }) => {
    return (
      <React.Fragment>
        {data.map((level) => (
          <div
            className="card my-2 py-2 rounded bg-dark mx-2 d-flex flex-column justify-content-center align-items-center"
            style={{ width: "15rem" }}
          >
            <img
              src={`https://media4.giphy.com/media/QyJTDR8VkUtyKHNPm9/giphy.gif?cid=ecf05e474xwxhwf6g9y2uxjv5g42tzcwtdsucszwwvsg5e3m&rid=giphy.gif&ct=s`}
              className="card-img-top"
              style={{ height: "150px", width: "150px" }}
              alt="..."
            />
            <div className="card-body text-center">
              <h5 className="card-title text-white">{`${title} #${level}`}</h5>

              <div
                onClick={() => setActiveNeuralNFT(level)}
                className="btn btn-secondary text-dark text-white fw-bold mx-1"
              >
                Manage
              </div>
              <div
                onClick={() => {
                  // Promt user if he really wants to delete
                  let warning = prompt(
                    "Are you sure you want to delete this NeuralNFT?",
                    "Yes",
                  );
                  warning === "Yes" &&
                    setDummy(data.filter((item) => item !== level));
                }}
                className="btn text-dark text-white fw-bold btn-danger  mx-1"
              >
                Burn
              </div>
            </div>
          </div>
        ))}
      </React.Fragment>
    );
  };
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 20 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 2.5 }}
      >
        <div className="text-white mt-5">
          <h1 className="fw-bold mb-5 text-white">Dashboard</h1>

          <h4 className=" mb-3 text-white">Recent Listings</h4>
          <div className="row justify-content-between">
            <Cards data={dummy} title="NeuralNFT" type="cricket" />
          </div>

          <div className="mt-4 d-flex justify-content-between">
            <div className=" col-3 me-3 justify-content-end">
              <h3 className="fw-bold text-secondary">
                ^ Select a NeuralNFT to update on-chain data.
              </h3>
              <h6 className="text-white">
                Currently selected:{" "}
                <span className="text-warning">#{activeNeuralNFT}</span>
              </h6>
            </div>

            <form className="d-flex col-4 justify-content-end">
              <div className="mb-3">
                <textarea
                  className="form-control"
                  name=""
                  id=""
                  rows="3"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-dark fw-bold mb-3">
                Update Metadata
              </button>
            </form>

            <form className="d-flex col-4 justify-content-end">
              <div className="mb-3">
                <textarea
                  className="form-control"
                  name=""
                  id=""
                  rows="3"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-dark fw-bold mb-3">
                Update Firmware
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Message;
