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
      "https://images.unsplash.com/photo-1586672806791-3a67d24186c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y292ZXIlMjBhcnR8ZW58MHx8MHx8&w=1350&q=80",
    description:
      "Co-founder at @nftconomy | Fabi loves technology, the Halo games & the star-wars franchise - also prequels | Buidling #web3 analytics",
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

      {/* Profile Section */}
      <div
        style={{
          opacity: 0.6,
          backgroundImage: `url(${data.coverImageURL})`,
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
              src={data.avatarImgURL}
              alt=""
            />
          </div>
          <div className="col-md-9 text-white text-start p-4">
            <h1 className="fw-bold text-white pt-2">{data.name}</h1>
            <div className="">
              <span className="badge bg-dark text-white  rounded-pill text-dark btn-sm">
                📍{data.country}
              </span>{" "}
              <span className="badge bg-dark text-white rounded-pill text-dark btn-sm">
                🌐 {data.externalURL}
              </span>{" "}
              <span className="badge bg-dark text-white rounded-pill text-dark btn-sm">
                ✉️ {data.email}
              </span>{" "}
              <br />
              <p className="w-75 mt-2">{data.description}</p>
            </div>
          </div>
        </div>
      </div>
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
