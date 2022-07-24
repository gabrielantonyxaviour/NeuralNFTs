import React, { useEffect, useState } from "react";
import { useMoralis, useChain, useWeb3Contract } from "react-moralis";
import CeramicClient from "@ceramicnetwork/http-client";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { EthereumAuthProvider, ThreeIdConnect } from "@3id/connect";
import { DID } from "dids";
import { IDX } from "@ceramicstudio/idx";
import { ProjectLoader } from "./Dashboard";
import { useQuery, gql } from "@apollo/client";

import ABI from "../contracts/NNFT_ABI.json";
import axios from "axios";

function Profile() {
  const { isAuthenticated, user } = useMoralis();
  const [name, setName] = useState("");
  const [avatarImgURL, setAvatarImgURL] = useState("");
  const [coverImageURL, setCoverImageURL] = useState("");
  const [description, setDescription] = useState("");
  const [externalURL, setExternalURL] = useState("");
  const [country, setCountry] = useState("");

  const [loaded, setLoaded] = useState(false);

  async function connect() {
    const addresses = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return addresses;
  }

  async function readProfile() {
    const [address] = await connect();
    const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");
    const idx = new IDX({ ceramic });

    try {
      const data = await idx.get("basicProfile", `${address}@eip155:1`);
      console.log("data: ", data, "address: ", address);
      if (data.name) setName(data.name);
      if (data.avatarImgURL) setAvatarImgURL(data.avatarImgURL);
      if (data.coverImageURL) setCoverImageURL(data.coverImageURL);
      if (data.description) setDescription(data.description);
      if (data.externalURL) setExternalURL(data.externalURL);
      if (data.country) setCountry(data.country);
      setLoaded(true);
    } catch (error) {
      setLoaded(true);
      console.log("error: ", error);
    }
  }

  const fabian = {
    name: "Fabian Ferno",
    avatarImgURL:
      "https://64.media.tumblr.com/73354947f7e524a5cdadaec2ef77fc41/709a1397f7446f1d-65/s400x600/16e5a7bae6da4bb72ffe3b180de9b3b90f417bb7.png",
    coverImageURL:
      "https://images.unsplash.com/photo-1586672806791-3a67d24186c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y292ZXIlMjBhcnR8ZW58MHx8MHx8&w=1350&q=80",
    description:
      "Co-founder at @nftconomy | Fabi loves technology, the Halo games & the star-wars franchise - also prequels | Buidling #web3 analytics",
    externalURL: "https:/www.github.com/fabianferno",
    country: "Argentina",
  };

  async function updateProfile() {
    try {
      const [address] = await connect();
      const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");
      const threeIdConnect = new ThreeIdConnect();
      const provider = new EthereumAuthProvider(window.ethereum, address);

      await threeIdConnect.connect(provider);

      const did = new DID({
        provider: threeIdConnect.getDidProvider(),
        resolver: {
          ...ThreeIdResolver.getResolver(ceramic),
        },
      });

      ceramic.setDID(did);
      await ceramic.did.authenticate();

      const idx = new IDX({ ceramic });

      await idx.set("basicProfile", fabian);

      console.log("Profile updated!");
    } catch (e) {
      console.log("error: ", e);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      // add your logic here
      readProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div className="text-white mt-5">
      <h1 className="fw-bold mb-5 text-white">Profile</h1>{" "}
      <div className="my-3">
        <CreatedNFTs />
        <ListedNFTs />
      </div>
      {!loaded && <ProjectLoader />}
      {loaded && (
        <section>
          {/* Profile Section */}
          <div
            style={{
              opacity: 0.6,
              backgroundImage: `url(${coverImageURL || fabian.coverImageURL})`,
              paddingTop: "5rem",
            }}
            className="mb-5 rounded row"
          >
            <div
              style={{ background: "#000000aa" }}
              className="mt-5 d-flex align-items-center justify-content-start"
            >
              <div className="col-md-2 d-flex justify-content-center align-items-center">
                <img
                  style={{
                    width: "80%",
                  }}
                  className="rounded-circle"
                  src={avatarImgURL || fabian.avatarImgURL}
                  alt=""
                />
              </div>
              <div className="col-md-9 text-white text-start p-4">
                <h1 className="fw-bold text-white pt-2">
                  {name || fabian.name}
                </h1>
                <div className="">
                  <span className="badge bg-dark text-white  rounded-pill text-dark btn-sm">
                    📍{country || fabian.country}
                  </span>{" "}
                  <span className="badge bg-dark text-white rounded-pill text-dark btn-sm">
                    🌐 {externalURL || fabian.externalURL}
                  </span>{" "}
                  <br />
                  <p className="w-75 mt-2">
                    {description || fabian.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <form>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                0xAddress
              </label>
              <input
                type="text"
                className="bg-dark text-white form-control"
                value={user?.attributes.ethAddress}
                disabled
              />
              <div id="emailHelp" className="form-text">
                Connected with Metamask wallet
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                className="bg-dark text-white form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Avatar Image URL
              </label>
              <input
                onChange={(e) => setAvatarImgURL(e.target.value)}
                value={avatarImgURL}
                type="text"
                className="bg-dark text-white form-control"
              />
              <img
                className="rounded-circle bg-dark mt-3"
                style={{ width: "100px" }}
                src={avatarImgURL}
                alt=""
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Cover Image URL
              </label>
              <input
                onChange={(e) => setCoverImageURL(e.target.value)}
                value={coverImageURL}
                type="text"
                className="bg-dark text-white form-control"
              />
              <img
                className="rounded bg-dark mt-3"
                style={{
                  height: "350px",
                  width: "100%",
                }}
                src={coverImageURL}
                alt=""
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Description
              </label>
              <input
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                type="text"
                className="bg-dark text-white form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                External URL
              </label>
              <input
                onChange={(e) => setExternalURL(e.target.value)}
                value={externalURL}
                type="text"
                className="bg-dark text-white form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Country of Residence
              </label>
              <input
                onChange={(e) => setCountry(e.target.value)}
                value={country}
                type="text"
                className="bg-dark text-white form-control"
              />
            </div>

            <div
              onClick={updateProfile}
              className="btn btn-warning fw-bold d-flex justify-content-center"
            >
              Apply changes & update profile
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

export function OwnedNFTCard(props) {
  const {
    runContractFunction, // eslint-disable-line
    error,
    isLoading,
  } = useWeb3Contract({
    abi: ABI,
    contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
    functionName: "listItem",
    params: {
      tokenId: props.nft.token_id,
      price: "1000000000000000",
    },
    msgValue: "1000000000000000",
  });

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  });

  function listForSale() {
    runContractFunction();
  }

  return (
    <section>
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
            <p className="text-start pt-3 d-block">
              {props.nft.metadata.attributes[3].value}
            </p>{" "}
            <br />
          </div>
        </motion.div>
      </Link>
      <div
        onClick={listForSale}
        className="d-flex mt-3 fw-bold bg-warning btn "
      >
        List for 0.01 ETH {isLoading && <Spinner />}
      </div>
    </section>
  );
}

export default Profile;

function Spinner() {
  return (
    <div className="spinner-border text-primary" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
}

function CreatedNFTs() {
  const { user } = useMoralis();
  const { data } = useQuery(gql`
    {
      allNfts(first: 5, where: { creator: "${user?.attributes.ethAddress}" }) {
        id
        creator
        tokenId
      }
    }
  `);

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
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    (async () => {
      if (data) {
        let tokens = data.allNfts;
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
              });
            })
            .catch(function (error) {
              console.error(error);
            });
        }
        console.log(all_tokens_with_data);
        setNfts(all_tokens_with_data);
      }
    })();
  }, []);

  return (
    <section>
      <h2 className="text-white">Created NFTs</h2>
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
          {nfts.map((nft, index) => (
            <OwnedNFTCard threed straight key={index} nft={nft} />
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
}

function ListedNFTs() {
  const { user } = useMoralis(); // eslint-disable-line
  const { data } = useQuery(gql`
    {
      activeItems(first: 5, where: { seller: "${user?.attributes.ethAddress}" }) {
        id
        buyer
        seller
        tokenId
        price
      }
    }
  `);

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
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    (async () => {
      if (data) {
        let tokens = data.allNfts;
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
              });
            })
            .catch(function (error) {
              console.error(error);
            });
        }
        console.log(all_tokens_with_data);
        setNfts(all_tokens_with_data);
      }
    })();
  }, []);

  return (
    <section>
      <h2 className="text-white">Listed NFTs</h2>
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
          {nfts.map((nft, index) => (
            <OwnedNFTCard threed straight key={index} nft={nft} />
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
}
