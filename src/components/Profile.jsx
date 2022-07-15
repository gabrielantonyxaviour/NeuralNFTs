import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

function Validate() {
  const { isAuthenticated, user } = useMoralis();

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
          <input type="text" className="bg-dark text-white form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Avatar Image URL
          </label>
          <input type="text" className="bg-dark text-white form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Cover Image URL
          </label>
          <input type="text" className="bg-dark text-white form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Description
          </label>
          <input type="text" className="bg-dark text-white form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            External URL
          </label>
          <input type="text" className="bg-dark text-white form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Country
          </label>
          <input type="text" className="bg-dark text-white form-control" />
        </div>

        <div className="btn btn-danger fw-bold d-flex justify-content-center">
          Validate your Device on the blockchain
        </div>
      </form>
    </div>
  );
}

export default Validate;
