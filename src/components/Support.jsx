import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Client } from "@xmtp/xmtp-js";

function Support() {
  const { isAuthenticated, user, Moralis } = useMoralis();
  const ethers = Moralis.web3Library;
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  async function sendMessage() {
    await conversation.send("Hello world");
  }

  useEffect(() => {
    if (isAuthenticated) {
      // add your logic here
      console.dir(user?.attributes.ethAddress);
      (async () => {
        const xmtp = await Client.create(ethers.Signer);
        const conversation = await xmtp.conversations.newConversation(
          "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        );
        setConversation(conversation);
        // Load all messages in the conversation
        const messages = await conversation.messages();
        setMessages(messages);

        // Listen for new messages in the conversation
        for await (const message of await conversation.streamMessages()) {
          console.log(`[${message.senderAddress}]: ${message.text}`);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div className="text-white mt-5">
      <h1 className="fw-bold mb-5 text-white">Dev Support</h1>
      <div className="btn btn-dark" onClick={() => sendMessage()}>
        Send Message
      </div>
      {messages.length > 0 && (
        <div className="text-white">
          {messages.map((message) => (
            <div>{JSON.stringify(message)}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Support;
