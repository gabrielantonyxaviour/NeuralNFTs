import { useWeb3Contract } from "react-moralis";
import {
  nftMarketplaceAbi,
  contractAddress,
} from "../constants/NftMarketplace.json";

function buyItem(nftAddress, tokenId) {
  const marketplaceAddress = contractAddress;

  const { runContractFunction } = useWeb3Contract();

  const cancelOptions = {
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "buyItem",
    msgValue: price,
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
