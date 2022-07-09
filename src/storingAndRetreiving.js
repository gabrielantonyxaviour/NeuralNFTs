import { Web3Storage, Blob, File } from "web3.storage";
import fetch from "node-fetch";
import fs from "fs";
import mime from "mime";
import path from "path";
import "dotenv/config";
const API_TOKEN = process.env.API_TOKEN;
async function storeFiles() {
  const client = new Web3Storage({ token: API_TOKEN });
  //Uploading mode.json file
  const obj = { hello: "world" }; // For model.json
  const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });
  const fullFilePathJsonModel = path.resolve("./Lato-Regular.bin");
  const contentJsonModel = await fs.promises.readFile(fullFilePath);
  const typeJsonModel = mime.getType(fullFilePath);
  // Uploading bin file
  const fullFilePathBin = path.resolve("./Lato-Regular.bin");
  const contentBin = await fs.promises.readFile(fullFilePath);
  const typeBin = mime.getType(fullFilePath);
  const files = [
    new File([contentJsonModel], path.basename(fullFilePathJsonModel), {
      typeJsonModel,
    }),
    new File([contentBin], path.basename(fullFilePathBin), { typeBin }),
  ];
  const result = await client.put(files); // upload the files obtained from user input [ model.json,model.weights.bin]
  console.log(result);
}
async function retrieve(cid) {
  console.log(cid + ".ipfs.dweb.link");

  const client = new Web3Storage({ token: API_TOKEN });
  const res = await client.get(cid);
  console.log(`Got a response! [${res.status}] ${res.statusText}`);
  if (!res.ok) {
    throw new Error(`failed to get ${cid}`);
  }
  const files = await res.files();
  console.log(await files[0].text()); // We will get bin file
  console.log(await files[1].text()); // We will get json file
}
retrieve("bafybeicgwan26tx2htgmtfoeqhznj3jw5hamso2uk7wpzvucfc3hfhw6ni");
// storeFiles();
