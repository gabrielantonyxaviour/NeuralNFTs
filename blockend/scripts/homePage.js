import { useQuery, gql } from "@apollo/client";

const GET_ACTIVE_ITEMS = gql`
  {
    activeItems(first: 10, where: { buyer: "0x00000000" }) {
      id
      buyer
      seller
      nftAddress
      tokenId
      price
    }
  }
`;

export default function homePageNFTs() {
  const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS);
  console.log(data);
  // Use NFTPort to fetch from IPFS
}
