import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { ProjectLoader } from "./Dashboard";

function Mint() {
  const { isAuthenticated, user } = useMoralis(); // eslint-disable-line

  const [loaded, setLoaded] = useState(false); // eslint-disable-line

  useEffect(() => {
    if (isAuthenticated) {
      // add your logic here
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div className="text-white mt-5">
      <h1 className="fw-bold mb-5 text-white">👾 Mint a new NeuralNFT</h1>{" "}
      {!loaded && <ProjectLoader />}
      {loaded && <section></section>}
    </div>
  );
}

export default Mint;
