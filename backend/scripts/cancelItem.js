import { useWeb3Contract } from "react-moralis";
import {
  nftMarketplaceAbi,
  contractAddress,
} from "../constants/NftMarketplace.json";

function cancelListing(nftAddress, tokenId) {
  const marketplaceAddress = contractAddress;

  const { runContractFunction } = useWeb3Contract();

  const cancelOptions = {
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "cancelListing",
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
    },
  };
  
  await runContractFunction({
    params: cancelOptions,
    onSuccess: ()=> {console.log("Successfully cancelled listing")},
    onError: (error) => {
        console.log(error)
    },
})
}
