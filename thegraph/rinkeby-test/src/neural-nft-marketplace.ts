import { Address } from "@graphprotocol/graph-ts";
import {
  ItemBought as ItemBoughtEvent,
  ItemCancelled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
  NewNftMinted as NewNftMintedEvent,
  NftRoyaltyUpdated as NftRoyaltyUpdatedEvent,
  Transfer as TransferEvent,
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
} from "../generated/NeuralNFTMarketplace/NeuralNFTMarketplace";
import { ItemListed, ActiveItem, AllNft } from "../generated/schema";

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed = ItemListed.load(event.params.tokenId.toHexString());
  let activeItem = ActiveItem.load(event.params.tokenId.toHexString());
  if (!itemListed) {
    itemListed = new ItemListed(event.params.tokenId.toHexString());
  }
  if (!activeItem) {
    activeItem = new ActiveItem(event.params.tokenId.toHexString());
  }
  itemListed.seller = event.params.seller;
  activeItem.seller = event.params.seller;

  itemListed.tokenId = event.params.tokenId;
  activeItem.tokenId = event.params.tokenId;

  itemListed.price = event.params.price;
  activeItem.price = event.params.price;

  activeItem.buyer = Address.fromString(
    "0x0000000000000000000000000000000000000000",
  );

  itemListed.save();
  activeItem.save();
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let activeItem = ActiveItem.load(event.params.tokenId.toHexString());

  activeItem!.buyer = Address.fromString(
    "0x000000000000000000000000000000000000dEaD",
  );

  activeItem!.save();
}

export function handleItemBought(event: ItemBoughtEvent): void {
  let activeItem = ActiveItem.load(event.params.tokenId.toHexString());

  activeItem!.buyer = event.params.buyer;

  activeItem!.save();
}

export function handleNewNftMinted(event: NewNftMintedEvent): void {
  let allNft = AllNft.load(event.params.tokenId.toHexString());

  if (!allNft) {
    allNft = new AllNft(event.params.tokenId.toHexString());
  }

  allNft.creator = event.params.creator;
  allNft.tokenId = event.params.tokenId;
  allNft.royalty = event.params.royaltyFees;
  allNft.save();
}

export function handleNftRoyaltyUpdated(event: NftRoyaltyUpdatedEvent): void {
  let allNft = AllNft.load(event.params.tokenId.toHexString());

  allNft!.royalty = event.params.royaltyFees;

  allNft!.save();
}

export function handleTransfer(event: TransferEvent): void {}

export function handleApproval(event: ApprovalEvent): void {}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {}
