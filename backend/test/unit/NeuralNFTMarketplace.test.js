const { assert, expect } = require("chai")
const { parse } = require("dotenv")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NeuralNFT Marketplace Unit Tests", function () {
          // test init
          let nftMarketplace, nftMarketplaceContract
          const LIST_FEE = ethers.utils.parseEther("0.001")
          const PRICE = ethers.utils.parseEther("0.1")
          const TOKEN_ID = 0
          const TOKEN_URI =
              "https://bafybeibq4luslahikv5hjnygzaus4vzxhvb4ye7w56zppf5u7jbgl26dre.ipfs.dweb.link/text_metadata.json/text_metadata.json"
          const TOKEN_URI_2 =
              "https://bafybeigmwo53luzltppqszqnj6mmtkwq5z6hwyy5fniityl3xf7sw2mnsu.ipfs.dweb.link/video_metadata.json"

          // executes before executing each test
          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              user = accounts[1]
              await deployments.fixture(["all"])
              nftMarketplaceContract = await ethers.getContract("NeuralNFTMarketplace")
              nftMarketplace = nftMarketplaceContract.connect(user)
              await nftMarketplace.mintNft(TOKEN_URI, user.address, 1000)
          })

          // testing constructor workflow
          describe("constructor", function () {
              it("initializes name and symbol of the NFT", async function () {
                  assert.equal(await nftMarketplace.name(), "NeuralNFT")
                  assert.equal(await nftMarketplace.symbol(), "NNFT")
              })
          })

          // testing mintNft workflow
          describe("mintNft", function () {
              it("mints the nft to the creator", async function () {
                  const owner = await nftMarketplace.ownerOf(TOKEN_ID)
                  assert.equal(owner.toString(), user.address)
              })

              it("verifies the metadata stored", async function () {
                  const metadata_URL = await nftMarketplace.tokenURI(TOKEN_ID)
                  assert.equal(metadata_URL.toString(), TOKEN_URI)
              })

              it("sets token royalty and verifies royalty address", async function () {
                  const [royaltyAddress, royaltyAmount] = await nftMarketplace.royaltyInfo(
                      TOKEN_ID,
                      PRICE
                  )
                  const royaltyFraction = 0.1
                  assert.equal(royaltyAmount.toString(), PRICE * royaltyFraction)
                  assert.equal(royaltyAddress.toString(), user.address)
              })

              it("updates creator", async function () {
                  assert.equal(
                      (await nftMarketplace.getCreator(TOKEN_ID)).toString(),
                      user.address
                  )
              })

              it("emits event for minting NFT", async function () {
                  expect(await nftMarketplace.mintNft(TOKEN_URI_2, user.address, 1000)).to.emit(
                      "NewNftMinted"
                  )
              })

              it("reverts if royalty is too high", async function () {
                  let royalty_fees = 2001
                  await expect(
                      nftMarketplace.mintNft(TOKEN_URI_2, user.address, 2001)
                  ).to.be.revertedWith(`NeuralNFTMarketplace__RoyaltyFeesTooHigh(${royalty_fees})`)
              })
          })

          // testing setRoyaltyInfo workflow
          describe("setRoyaltyInfo", function () {
              it("reverts if royalty is too high", async function () {
                  let royalty_fees = 2001
                  await expect(
                      nftMarketplace.setRoyaltyInfo(TOKEN_ID, user.address, royalty_fees)
                  ).to.be.revertedWith(`NeuralNFTMarketplace__RoyaltyFeesTooHigh(${royalty_fees})`)
              })

              it("reverts if the caller is not the creator", async function () {
                  nftMarketplace = nftMarketplaceContract.connect(deployer)
                  await expect(
                      nftMarketplace.setRoyaltyInfo(TOKEN_ID, deployer.address, 1000)
                  ).to.be.revertedWith("NeuralNFTMarketplace__NotCreator")
              })

              it("sets token royalty and verifies royalty address", async function () {
                  await nftMarketplace.setRoyaltyInfo(TOKEN_ID, accounts[4].address, 690)
                  const [royaltyAddress, royaltyAmount] = await nftMarketplace.royaltyInfo(
                      TOKEN_ID,
                      PRICE
                  )
                  const royaltyFraction = 0.069
                  assert.equal(royaltyAmount.toString(), parseInt(PRICE * royaltyFraction) - 1)
                  assert.equal(royaltyAddress.toString(), accounts[4].address)
              })

              it("emits an event for updating metdata", async function () {
                  expect(
                      await nftMarketplace.setRoyaltyInfo(TOKEN_ID, accounts[3].address, 420)
                  ).to.emit("NewNftMinted")
              })
          })

          // testing listItem workflow
          describe("listItem", function () {
              it("reverts if listfee is not paid", async function () {
                  await expect(
                      nftMarketplace.listItem(TOKEN_ID, PRICE, { value: LIST_FEE - 100 })
                  ).to.be.revertedWith("NeuralNFTMarketplace__InsufficientFunds")
              })

              it("reverts if price is zero", async function () {
                  await expect(
                      nftMarketplace.listItem(TOKEN_ID, 0, { value: LIST_FEE })
                  ).to.be.revertedWith("NeuralNFTMarketplace__PriceMustBeAboveZero")
              })

              it("emits an event after listing an item", async function () {
                  expect(
                      await nftMarketplace.listItem(TOKEN_ID, PRICE, { value: LIST_FEE })
                  ).to.emit("ItemListed")
              })

              it("does not allow to list twice", async function () {
                  await nftMarketplace.listItem(TOKEN_ID, PRICE, { value: LIST_FEE })
                  await expect(
                      nftMarketplace.listItem(TOKEN_ID, PRICE, { value: LIST_FEE })
                  ).to.be.revertedWith(`AlreadyListed(${TOKEN_ID})`)
              })

              it("exclusively allows owners to list", async function () {
                  nftMarketplace = nftMarketplaceContract.connect(accounts[2])
                  await expect(nftMarketplace.listItem(TOKEN_ID, PRICE)).to.be.revertedWith(
                      "NeuralNFTMarketplace__NotOwner"
                  )
              })

              it("Updates listing with seller and price", async function () {
                  await nftMarketplace.listItem(TOKEN_ID, PRICE, { value: LIST_FEE })
                  const listing = await nftMarketplace.getListing(TOKEN_ID)
                  assert.equal(listing.price.toString(), PRICE.toString())
                  assert.equal(listing.seller.toString(), user.address)
              })

              it("Sends list fee to the owner", async function () {
                  await nftMarketplace.listItem(TOKEN_ID, PRICE, { value: LIST_FEE })
                  nftMarketplace = nftMarketplaceContract.connect(deployer)
                  let ethEarnedByUser = await nftMarketplace.getEarnings()
                  let listfee = await nftMarketplace.getListFee()
                  assert.equal(ethEarnedByUser.toString(), listfee.toString())
              })
          })

          // testing cancelListing workflow
          describe("cancelListing", function () {
              it("reverts if there is no listing", async function () {
                  await expect(nftMarketplace.cancelListing(TOKEN_ID)).to.be.revertedWith(
                      `NotListed(${TOKEN_ID})`
                  )
              })
              it("reverts if anyone but the owner tries to call", async function () {
                  await nftMarketplace.listItem(TOKEN_ID, PRICE, { value: LIST_FEE })
                  nftMarketplace = nftMarketplaceContract.connect(accounts[2])
                  await expect(nftMarketplace.cancelListing(TOKEN_ID)).to.be.revertedWith(
                      "NeuralNFTMarketplace__NotOwner"
                  )
              })

              it("emits event and removes listing", async function () {
                  await nftMarketplace.listItem(TOKEN_ID, PRICE, { value: LIST_FEE })
                  expect(await nftMarketplace.cancelListing(TOKEN_ID)).to.emit("ItemCanceled")
                  const listing = await nftMarketplace.getListing(TOKEN_ID)
                  assert.equal(listing.price.toString(), "0")
              })
          })

          // testing buyItem workflow
          describe("buyItem", function () {
              it("reverts if the item is not listed", async function () {
                  await expect(nftMarketplace.buyItem(TOKEN_ID)).to.be.revertedWith(
                      `NeuralNFTMarketplace__NotListed(${TOKEN_ID})`
                  )
              })
              it("reverts if the price is not met", async function () {
                  await nftMarketplace.listItem(TOKEN_ID, PRICE, { value: LIST_FEE })
                  await expect(nftMarketplace.buyItem(TOKEN_ID)).to.be.revertedWith(
                      `NeuralNFTMarketplace__PriceNotMet(${TOKEN_ID}, ${PRICE})`
                  )
              })
              it("emits event and removes listing", async function () {
                  await nftMarketplace.listItem(TOKEN_ID, PRICE, { value: LIST_FEE })
                  expect(await nftMarketplace.buyItem(TOKEN_ID, { value: PRICE })).to.emit(
                      "ItemBought"
                  )
                  const listing = await nftMarketplace.getListing(TOKEN_ID)
                  assert.equal(listing.price.toString(), "0")
              })
              it("transfers the nft to the buyer, adds earnings to seller and sends platform fee to owner", async function () {
                  let userEthPaid = PRICE
                  let platformFeePercentage = (await nftMarketplace.getPlatformFee()) * 0.01
                  nftMarketplace = nftMarketplaceContract.connect(user)
                  await nftMarketplace.listItem(TOKEN_ID, PRICE, { value: LIST_FEE })
                  nftMarketplace = nftMarketplaceContract.connect(accounts[3])

                  expect(await nftMarketplace.buyItem(TOKEN_ID, { value: userEthPaid })).to.emit(
                      "ItemBought"
                  )
                  let ethEarnedBySeller = (1 - platformFeePercentage) * userEthPaid
                  nftMarketplace = nftMarketplaceContract.connect(user)
                  let sellerBalance = await nftMarketplace.getEarnings()
                  nftMarketplace = nftMarketplaceContract.connect(deployer)
                  let ethEarnedByOwner =
                      parseInt(platformFeePercentage * userEthPaid) + parseInt(LIST_FEE)
                  let ownerBalance = await nftMarketplace.getEarnings()

                  // check ownership
                  assert.equal(await nftMarketplace.ownerOf(TOKEN_ID), accounts[3].address)
                  // check eth earned by seller
                  assert.equal(ethEarnedBySeller.toString(), sellerBalance.toString())
                  // check platform fee sent to owner
                  assert.equal(ethEarnedByOwner.toString(), ownerBalance.toString())
              })
          })

          // testing withdrawEarnings workflow
          describe("withdrawEarnings", function () {
              it("doesn't allow withdrawl with 0 wei in earnings", async function () {
                  await expect(nftMarketplace.withdrawEarnings()).to.be.revertedWith(
                      "NeuralNFTMarketplace__NoEarnings"
                  )
              })
              it("withdraws earnings", async function () {
                  await nftMarketplace.listItem(TOKEN_ID, PRICE, { value: LIST_FEE })
                  nftMarketplace = nftMarketplaceContract.connect(accounts[5])
                  await nftMarketplace.buyItem(TOKEN_ID, { value: PRICE })
                  nftMarketplace = nftMarketplaceContract.connect(user)

                  const userEarningsBefore = await nftMarketplace.getEarnings()
                  const userBalanceBefore = await user.getBalance()
                  const txResponse = await nftMarketplace.withdrawEarnings()
                  const transactionReceipt = await txResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const userBalanceAfter = await user.getBalance()

                  assert(
                      userBalanceAfter.add(gasCost).toString() ==
                          userEarningsBefore.add(userBalanceBefore).toString()
                  )
              })
          })

          // testing updateListing workflow
          describe("updateListing", function () {
              it("reverts if not Owner", async function () {
                  await nftMarketplace.listItem(TOKEN_ID, PRICE, { value: LIST_FEE })
                  nftMarketplace = nftMarketplaceContract.connect(accounts[9])
                  await expect(nftMarketplace.updateListing(TOKEN_ID, PRICE), {
                      value: LIST_FEE,
                  }).to.be.revertedWith("NeuralNFTMarketplace__NotOwner")
              })

              it("reverts if not Listed", async function () {
                  await expect(nftMarketplace.updateListing(TOKEN_ID, PRICE), {
                      value: LIST_FEE,
                  }).to.be.revertedWith("NeuralNFTMarketplace__NotListed")
              })

              it("reverts if list fee is insufficient", async function () {
                  await nftMarketplace.listItem(TOKEN_ID, PRICE, { value: LIST_FEE })
                  await expect(
                      nftMarketplace.updateListing(TOKEN_ID, PRICE, { value: LIST_FEE - 100 })
                  ).to.be.revertedWith("NeuralNFTMarketplace__InsufficientFunds")
              })

              it("reverts if price is 0", async function () {
                  await nftMarketplace.listItem(TOKEN_ID, PRICE, { value: LIST_FEE })
                  await expect(
                      nftMarketplace.updateListing(TOKEN_ID, 0, {
                          value: LIST_FEE,
                      })
                  ).to.be.revertedWith("NeuralNFTMarketplace__PriceMustBeAboveZero")
              })

              it("updates the price of the item, and emits an event", async function () {
                  const updatedPrice = PRICE + 1000
                  await nftMarketplace.listItem(TOKEN_ID, PRICE, { value: LIST_FEE })
                  expect(
                      await nftMarketplace.updateListing(TOKEN_ID, updatedPrice, {
                          value: LIST_FEE,
                      })
                  ).to.emit("ItemListed")
                  const listing = await nftMarketplace.getListing(TOKEN_ID)
                  assert(listing.price.toString() == updatedPrice.toString())
              })

              it("Sends list fee to the owner", async function () {
                  await nftMarketplace.listItem(TOKEN_ID, PRICE, { value: LIST_FEE })
                  await nftMarketplace.updateListing(TOKEN_ID, PRICE + 2000, { value: LIST_FEE })
                  nftMarketplace = nftMarketplaceContract.connect(deployer)
                  let ethEarnedByUser = await nftMarketplace.getEarnings()
                  let listfee = (await nftMarketplace.getListFee()) * 2 // Listing fee and updating fee
                  assert.equal(ethEarnedByUser.toString(), listfee.toString())
              })
          })

          // testing setListFee workflow
          describe("setListFee", function () {
              it("exclusive only to the owner", async function () {
                  nftMarketplace = nftMarketplaceContract.connect(accounts[8])
                  await expect(nftMarketplace.setListFee(LIST_FEE + 100)).to.be.revertedWith(
                      "NeuralNFTMarketplace__NotOwner"
                  )
              })

              it("updates listing fee", async function () {
                  nftMarketplace = nftMarketplaceContract.connect(deployer)
                  await nftMarketplace.setListFee(LIST_FEE + 100)
                  const updatedListingFee = await nftMarketplace.getListFee()
                  assert.equal(updatedListingFee.toString(), (LIST_FEE + 100).toString())
              })
          })
      })
