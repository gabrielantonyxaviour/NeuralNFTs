const networkConfig = {
    default: {
        name: "hardhat",
    },
    31337: {
        name: "localhost",
        callbackGasLimit: "500000", // 500,000 gas
    },
    80001: {
        name: "mumbai",
        callbackGasLimit: "500000", // 500,000 gas
    },
    137: {
        name: "polygon",
        callbackGasLimit: "500000", // 500,000 gas
    },
}

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6

module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
}
