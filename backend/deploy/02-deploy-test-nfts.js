const { network } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------")
    let argsImage = [
        "ImageNeuralNFT",
        "INN",
        250,
        "https://ipfs.io/ipfs/bafybeicoerfuylvz4n35j74syjtp6m6xxnrl3lojvt7q7d75fjznqqio4e/image_metadata.json",
    ]
    const imageNeuralNft = await deploy("TestNft", {
        from: deployer,
        args: argsImage,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })
    let argsVideo = [
        "VideoNeuralNFT",
        "VNN",
        1000,
        "https://ipfs.io/ipfs/bafybeiebxtnslfnvzkqdvtlcwaxcyfyt7igsc4dtilvlethpyshchjrxwy/video_metadata.json",
    ]
    const videoNeuralNft = await deploy("TestNft", {
        from: deployer,
        args: argsVideo,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })
    let argsAudio = [
        "AudioNeuralNFT",
        "ANN",
        500,
        "https://ipfs.io/ipfs/bafybeibbwa67rvceip3mclgyna7usvshmwre7qwtjiaoziiawygzjayp2e/speech_metadata.json",
    ]
    const audioNeuralNft = await deploy("TestNft", {
        from: deployer,
        args: argsAudio,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })
    let argsText = [
        "TextNeuralNFT",
        "TNN",
        750,
        "https://ipfs.io/ipfs/bafybeigvtcbfvzuijs7f6j5qzrafsbwpp77ujvmi5brsgpo7nlqlxahojy/text_metadata.json",
    ]
    const textNeuralNft = await deploy("TestNft", {
        from: deployer,
        args: argsText,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(textNeuralNft.address, argsText)
        await verify(audioNeuralNft.address, argsAudio)
        await verify(videoNeuralNft.address, argsVideo)
        await verify(imageNeuralNft.address, argsImage)
    }
    log("----------------------------------------------------")
}

module.exports.tags = ["all", "testnft"]
