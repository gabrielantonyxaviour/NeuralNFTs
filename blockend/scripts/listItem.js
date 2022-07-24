import { useWeb3Contract } from "react-moralis";
import {
  nftMarketplaceAbi,
  contractAddress,
} from "../constants/NftMarketplace.json";

function listItem(nftAddress, tokenId,price) {
  const marketplaceAddress = contractAddress;

  const { runContractFunction } = useWeb3Contract();

    // approve NFT
const nftAbi=await fetchContractAbi();
    // List NFT
  const { runContractFunction: getListFee } = useWeb3Contract({
    abi: nftAbi,
    contractAddress: nftAddress,
    functionName: "getListFee",
    params: {
    },
})
const LIST_FEE=await getListFee()

  const listOptions = {
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "listItem",
    msgValue: LIST_FEE,
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
      price: price,
    },
  };
  
  await runContractFunction({
    params: listOptions,
    onSuccess: ()=> {console.log("Successfully listed NFT")},
    onError: (error) => {
        console.log(error)
    },
})
}
async function fetchContractAbi() {
    // Use graph to fetch it with the address of the contract

    // We are doing this to call the approve function for the token from the NFTcontract

}
