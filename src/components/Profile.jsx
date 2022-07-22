import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import CeramicClient from "@ceramicnetwork/http-client";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";

import { EthereumAuthProvider, ThreeIdConnect } from "@3id/connect";
import { DID } from "dids";
import { IDX } from "@ceramicstudio/idx";
import { ProjectLoader } from "./Dashboard";

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
      <h1 className="fw-bold mb-5 text-white">Edit Profile</h1>{" "}
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

export default Profile;
