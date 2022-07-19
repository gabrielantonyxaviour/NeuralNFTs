import { useQuery, gql } from "@apollo/client";

function profilePage(walletAddress) {
  const GET_LISTED_NFTS = gql`
    {
      itemListeds(where: { seller: walletAddress }) {
        id
        seller
        nftAddress
        tokenId
        price
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_LISTED_NFTS);
  console.log(data);

  // Retrive all NFT details from the query
  // Also retreive all owned NFTs
  // https://docs.nftport.xyz/docs/nftport/b3A6MjE0MDYzNzM-retrieve-nf-ts-owned-by-an-account
}
