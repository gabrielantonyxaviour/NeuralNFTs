import React, { useEffect, useRef } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";

// Import ABI Json from file
const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

function MintDevice() {
  const fileDropperRef = useRef(null);
  const outputRef = useRef(null);

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
      <h1 className="fw-bold mb-5 text-white">NeuralNFT</h1>
      <p>
        - Interactive NFT - Drop a file - Shows NFT metadata / details -
        Covalent Analytics Dashboard
      </p>

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
  );
}

export default MintDevice;
