import React, { useEffect, useState, useRef } from "react";
import { useMoralis } from "react-moralis";
import { ProjectLoader } from "./Dashboard";
import axios from "axios";

function Mint() {
  const fileDropperRef = useRef(null);
  const outputRef = useRef(null);
  const { isAuthenticated, user } = useMoralis(); // eslint-disable-line
  const [metadata, setMetadata] = useState({
    name: "",
    short_description: "",
    long_description: "",
    type: "",
    license: "",
    format: "",
    external_url: "",
  });

  async function mint() {
    const form = new FormData();
    form.append("file", "Web3 _ Atheon Group Services (1).pdf");

    const options = {
      method: "POST",
      url: "https://api.nftport.xyz/v0/files",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "ae7af491-c4de-4de0-b08a-c4a938fda265",
        "content-type":
          "multipart/form-data; boundary=---011000010111000001101001",
      },
      data: "[form]",
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
    console.log("Minting...");
  }

  const [loaded, setLoaded] = useState(true); // eslint-disable-line
  // TODO: Change to false when the project is loaded

  useEffect(() => {
    if (isAuthenticated) {
      // add your logic here
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const sample = {
    name: "Image Classifcation",
    image:
      "https://bafybeig6eb7xsxzhuqbajiiqw4oz73qn6ji6twzx3e5kvlmoqgut5jocmu.ipfs.dweb.link/image.gif",
    external_url: "https://github.com/keras-team/keras",
    attributes: [
      {
        name: "Type",
        value: "text_classification",
      },
      {
        name: "License",
        value: "Apache-2.0",
      },
      {
        name: "Format",
        value: "TF2.0",
      },
      {
        name: "short_description",
        value:
          "This model is the implementation of RegNetY[1] in TensorFlow 2.5.",
      },
      {
        name: "long_description",
        value:
          "This model is a pretrained classifier on ImageNet-1k. This means that you can directly classify images over 1000 predefined classes. Inputs to the model must: be four dimensional Tensors of the shape (batch_size, height, width, num_channels). Note that the model expects images with channels_last property. height,width and batch_size can be any value based on user's preference. num_channels must be 3. have pixel values in the range [0, 255].",
      },
      {
        name: "model_url",
        value:
          "https://bafybeiejnmwirb7yzyowtu4adlqftnnczv3vkmcuzhp4nuzijtkbpikf4q.ipfs.dweb.link/image_classification.gz",
      },
    ],
  };

  console.log(sample);

  return (
    <div className="text-white mt-5">
      <h1 className="fw-bold mb-5 text-white">👾 Mint a new NeuralNFT</h1>{" "}
      {!loaded && <ProjectLoader />}
      {loaded && (
        <section className="d-flex justify-content-center align-items-start">
          <div className="col-5">
            <div
              style={{
                border: "5px dashed",
                width: "440px",
                height: "272px",
              }}
              className="border-warning d-flex align-items-center justify-content-center"
              ref={fileDropperRef}
              onDragOver={(event) => {
                event.stopPropagation();
                event.preventDefault();
                event.dataTransfer.dropEffect = "copy";
              }}
              onDrop={(event) => {
                outputRef.current.innerHTML = "";
                event.stopPropagation();
                event.preventDefault();
                const files = event.dataTransfer.files;
                for (let i = 0; i < files.length; i++) {
                  const li = document.createElement("li");
                  const file = files[i];
                  const name = file.name ? file.name : "NOT SUPPORTED";
                  const type = file.type ? file.type : "NOT SUPPORTED";
                  const size = file.size ? file.size : "NOT SUPPORTED";
                  li.textContent = `name: ${name}, type: ${type}, size: ${size}`;
                  outputRef.current.appendChild(li);
                }
              }}
            >
              <h4 className="text-secondary fw-bold text-center">
                Drag and Drop files
              </h4>
            </div>
            <div ref={outputRef}></div>
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
                  Short Description
                </label>
                <input
                  onChange={(e) => {
                    setMetadata({
                      ...metadata,
                      short_description: e.target.value,
                    });
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
                    setMetadata({
                      ...metadata,
                      long_description: e.target.value,
                    });
                  }}
                  value={metadata.long_description}
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
                    setMetadata({
                      ...metadata,
                      type: e.target.value,
                    });
                  }}
                  value={metadata.type}
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
                    setMetadata({
                      ...metadata,
                      license: e.target.value,
                    });
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
                    setMetadata({
                      ...metadata,
                      format: e.target.value,
                    });
                  }}
                  value={metadata.format}
                  type="text"
                  className="bg-dark text-white form-control"
                />
              </div>

              <div
                onClick={mint}
                className="btn btn-warning fw-bold d-flex justify-content-center"
              >
                Mint
              </div>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}

export default Mint;
