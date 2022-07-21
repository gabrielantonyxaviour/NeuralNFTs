const networkConfig = {
  default: {
    name: "hardhat",
  },
  31337: {
    name: "localhost",
    raffleEntranceFee: "100000000000000000", // 0.1 ETH
    callbackGasLimit: "500000", // 500,000 gas
  },
  80001: {
    name: "mumbai",
    callbackGasLimit: "500000", // 500,000 gas
  },
  137: {
    name: "polygon",
    keepersUpdateInterval: "30",
  },
};

const developmentChains = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
// const frontEndContractsFile =
//   "../nextjs-nft-marketplace-moralis-fcc/constants/networkMapping.json";
// const frontEndContractsFile2 =
//   "../nextjs-nft-marketplace-thegraph-fcc/constants/networkMapping.json";
// const frontEndAbiLocation = "../nextjs-nft-marketplace-moralis-fcc/constants/";
// const frontEndAbiLocation2 =
//   "../nextjs-nft-marketplace-thegraph-fcc/constants/";

module.exports = {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  frontEndContractsFile,
  frontEndContractsFile2,
  frontEndAbiLocation,
  frontEndAbiLocation2,
};
