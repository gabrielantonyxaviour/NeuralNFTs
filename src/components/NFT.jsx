import React, { useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";

// Import ABI Json from file
const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

function MintDevice() {
  const {
    runContractFunction, // eslint-disable-line
    contractResponse,
    error,
    isRunning,
    isLoading,
  } = useWeb3Contract({
    //abi: ABI,
    contractAddress: contractAddress,
    functionName: "observe",
    params: {
      secondsAgos: [0, 10],
    },
  });

  console.log(contractResponse, error, isRunning, isLoading);

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
      <h1 className="text-white">{!isLoading && contractResponse}</h1>
      <h1 className="fw-bold mb-5 text-white">NeuralNFT</h1>- Interactive NFT -
      Drop a file - Shows NFT metadata / details - Covalent Analytics Dashboard
    </div>
  );
}

export default MintDevice;
