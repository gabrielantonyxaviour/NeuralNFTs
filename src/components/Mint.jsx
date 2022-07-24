import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ProjectLoader } from "./Dashboard"; // eslint-disable-line
import axios from "axios"; // eslint-disable-line

import ABI from "../contracts/NNFT_ABI.json";

function Mint() {
  const { isAuthenticated, user } = useMoralis(); // eslint-disable-line
  const [metadata, setMetadata] = useState({
    name: "",
    image: "",
    external_url: "",
    attributes: [
      {
        trait_type: "Type",
        value: "",
      },
      {
        trait_type: "License",
        value: "",
      },
      {
        trait_type: "Format",
        value: "",
      },
      {
        trait_type: "short_description",
        value: "",
      },
      {
        trait_type: "long_description",
        value: "",
      },
      {
        trait_type: "model_url",
        value: "",
      },
    ],
  });
  const [metadata_uri, setMetadataURI] = useState("");

  const {
    runContractFunction, // eslint-disable-line
    error,
    isLoading,
  } = useWeb3Contract({
    abi: ABI,
    contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
    functionName: "mintNft",
    params: {
      nftURI: metadata_uri,
      royaltyReceiver: user?.attributes.ethAddress,
      _royaltyFeesInBips: 420,
    },
  });

  async function mint() {
    let stuff = {
      ...metadata,
      description: metadata.attributes[3].value,
      file_url: metadata.image,
    };
    console.log(stuff);
    await axios
      .request({
        method: "POST",
        url: "https://api.nftport.xyz/v0/metadata",
        headers: {
          "Content-Type": "application/json",
          Authorization: "ae7af491-c4de-4de0-b08a-c4a938fda265",
        },
        data: stuff,
      })
      .then(function (response) {
        console.log(response.data);
        setMetadataURI(response.data.metadata_uri);
      })
      .catch(function (err) {
        console.error(err);
      });

    runContractFunction();
    console.log("Minting...");
  }

  async function uploadToIPFS(file) {
    console.log("Uploading to IPFS...");
    const form = new FormData();
    form.append("file", file);

    let ipfs_url = await axios
      .request({
        method: "POST",
        url: "https://api.nftport.xyz/v0/files",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "ae7af491-c4de-4de0-b08a-c4a938fda265",
          "content-type":
            "multipart/form-data; boundary=---011000010111000001101001",
        },
        data: form,
      })
      .then(function (response) {
        return response.data.ipfs_url;
      })
      .catch(function (error) {
        console.error(error);
      });

    return ipfs_url;
  }

  useEffect(() => {
    if (isAuthenticated) {
      // add your logic here
      if (error) {
        console.log("Error: ", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div className="text-white mt-5">
      <h1 className="fw-bold mb-5 text-white">👾 Mint a new NeuralNFT</h1>{" "}
      <section className="d-flex justify-content-center align-items-start">
        <div className="col-5">
          <div className="mx-4">
            <div className="">
              {" "}
              <label htmlFor="formFileLg" className="form-label">
                Upload the ML Model to the IPFS
              </label>
              <input
                onChange={async (e) => {
                  console.log(e.target.files[0]);
                  let url = await uploadToIPFS(e.target.files[0]);
                  let attributes = metadata.attributes;
                  attributes[5] = {
                    trait_type: "model_url",
                    value: url,
                  };
                  setMetadata({ ...metadata, attributes });
                }}
                className="p-5 form-control form-control-lg bg-dark text-warning fw-bold"
                id="formFileLg"
                type="file"
              />
            </div>

            <div className="my-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Model URL
              </label>
              <input
                disabled
                value={metadata.attributes[5].value}
                type="text"
                className=" bg-secondary text-white form-control"
              />
            </div>

            <div className="my-3">
              {" "}
              <label htmlFor="formFileLg" className="form-label">
                Upload the NFT image to the IPFS
              </label>
              <input
                onChange={async (e) => {
                  console.log(e.target.files[0]);
                  let url = await uploadToIPFS(e.target.files[0]);
                  setMetadata({ ...metadata, image: url });
                }}
                className="p-5 form-control form-control-lg bg-dark text-warning fw-bold"
                id="formFileLg"
                type="file"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Image URL
              </label>
              <input
                disabled
                value={metadata.image}
                type="text"
                className=" bg-secondary text-white form-control"
              />
            </div>
            <div
              onClick={mint}
              className="my-3 py-3 btn-lg btn-warning fw-bold d-flex justify-content-center"
            >
              Mint ⛓️ {isLoading && <Spinner />}
            </div>
          </div>
        </div>
        <div className="col-7">
          <form>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Name of the NeuralNFT
              </label>
              <input
                onChange={(e) =>
                  setMetadata({ ...metadata, name: e.target.value })
                }
                value={metadata.name}
                type="text"
                className="bg-dark text-white form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                External URL
              </label>
              <input
                onChange={(e) => {
                  setMetadata({ ...metadata, external_url: e.target.value });
                }}
                value={metadata.external_url}
                type="text"
                className="bg-dark text-white form-control"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Type
              </label>
              <input
                onChange={(e) => {
                  let attributes = metadata.attributes;
                  attributes[0] = {
                    trait_type: "Type",
                    value: e.target.value,
                  };
                  setMetadata({ ...metadata, attributes });
                }}
                value={metadata.attributes[0].value}
                type="text"
                className="bg-dark text-white form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                License{" "}
              </label>
              <input
                onChange={(e) => {
                  let attributes = metadata.attributes;
                  attributes[1] = {
                    trait_type: "License",
                    value: e.target.value,
                  };
                  setMetadata({ ...metadata, attributes });
                }}
                value={metadata.license}
                type="text"
                className="bg-dark text-white form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Format
              </label>
              <input
                onChange={(e) => {
                  let attributes = metadata.attributes;
                  attributes[2] = {
                    trait_type: "Format",
                    value: e.target.value,
                  };
                  setMetadata({ ...metadata, attributes });
                }}
                value={metadata.format}
                type="text"
                className="bg-dark text-white form-control"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Short Description
              </label>
              <input
                onChange={(e) => {
                  let attributes = metadata.attributes;
                  attributes[3] = {
                    trait_type: "short_description",
                    value: e.target.value,
                  };
                  setMetadata({ ...metadata, attributes });
                }}
                value={metadata.short_description}
                type="text"
                className="bg-dark text-white form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Long Description
              </label>
              <textarea
                rows={5}
                onChange={(e) => {
                  let attributes = metadata.attributes;
                  attributes[4] = {
                    trait_type: "long_description",
                    value: e.target.value,
                  };
                  setMetadata({ ...metadata, attributes });
                }}
                value={metadata.long_description}
                type="text"
                className="bg-dark text-white form-control"
              />
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

function Spinner() {
  return (
    <div className="spinner-border text-warning" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Mint;
