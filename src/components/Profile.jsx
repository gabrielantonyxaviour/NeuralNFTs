import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

function Validate() {
  const { isAuthenticated, user } = useMoralis();

  const data = {
    name: "Fabian Ferno",
    email: "fabianferno@gmail.com",
    avatarImgURL:
      "https://64.media.tumblr.com/73354947f7e524a5cdadaec2ef77fc41/709a1397f7446f1d-65/s400x600/16e5a7bae6da4bb72ffe3b180de9b3b90f417bb7.png",
    coverImageURL:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1450&h=350&q=80",
    description: "I am a software developer and I love to learn new things.",
    externalURL: "https:/www.github.com/fabianferno",
    country: "Argentina",
  };

  useEffect(() => {
    if (isAuthenticated) {
      // add your logic here
      console.dir(user?.attributes.ethAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div className="text-white mt-5">
      <h1 className="fw-bold mb-5 text-white">Profile</h1>
      <form>
        {/* - name, avatar:image, coverImage:image, description, url, residenceCountry, */}

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
            value={data.name}
            type="text"
            className="bg-dark text-white form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Avatar Image URL
          </label>
          <input
            value={data.avatarImgURL}
            type="text"
            className="bg-dark text-white form-control"
          />
          <img
            className="rounded-circle bg-dark mt-3"
            style={{ width: "100px" }}
            src={data.avatarImgURL}
            alt=""
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Cover Image URL
          </label>
          <input
            value={data.coverImageURL}
            type="text"
            className="bg-dark text-white form-control"
          />
          <img
            className="rounded bg-dark mt-3"
            style={{
              height: "350px",
              width: "100%",
            }}
            src={data.coverImageURL}
            alt=""
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Description
          </label>
          <input
            value={data.description}
            type="text"
            className="bg-dark text-white form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            External URL
          </label>
          <input
            value={data.externalURL}
            type="text"
            className="bg-dark text-white form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Country of Residence
          </label>
          <input
            value={data.country}
            type="text"
            className="bg-dark text-white form-control"
          />
        </div>

        <div className="btn btn-warning fw-bold d-flex justify-content-center">
          Apply changes & update profile
        </div>
      </form>
    </div>
  );
}

export default Validate;
