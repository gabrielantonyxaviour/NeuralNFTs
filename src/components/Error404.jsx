import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

function Error404() {
  const { isAuthenticated, user } = useMoralis();

  useEffect(() => {
    if (isAuthenticated) {
      // add your logic here
      console.dir(user?.attributes.ethAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div className="text-white mt-5 text-start">
      <h1 style={{ fontSize: "13rem" }} className="fw-bold mb-5 text-warning">
        Are you lost?
      </h1>
      <a href="/" className="h4 text-white">
        ⬅️ Take me back
      </a>
    </div>
  );
}

export default Error404;
