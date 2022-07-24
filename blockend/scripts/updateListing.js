import { useWeb3Contract } from "react-moralis";
import {
  nftMarketplaceAbi,
  contractAddress,
} from "../constants/NftMarketplace.json";

function updateListing(nftAddress, tokenId, newPrice) {
  const marketplaceAddress = contractAddress;

  const { runContractFunction } = useWeb3Contract();

  const updateOptions = {
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "updateListing",
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
      newPrice: newPrice,
    },
  };
  
  await runContractFunction({
    params: updateOptions,
    onSuccess: ()=> {console.log("Successfully updated listing")},
    onError: (error) => {
        console.log(error)
    },
})
}
