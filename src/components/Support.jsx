import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Client } from "@xmtp/xmtp-js";

function Support() {
  const { isAuthenticated, Moralis } = useMoralis();
  const ethers = Moralis.web3Library;
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  async function sendMessage() {
    await conversation.send("Hello world");
  }

  useEffect(() => {
    if (isAuthenticated) {
      // add your logic here

      (async () => {
        const wallet = ethers.Wallet.createRandom();
        const xmtp = await Client.create(wallet);
        const conversation = await xmtp.conversations.newConversation(
          "0x64574dDbe98813b23364704e0B00E2e71fC5aD17",
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
    <div className="text-white mt-5 text-end">
      <h1 className="fw-bold text-white">Support</h1>
      <h5 className="text-secondary mb-5 ">
        powered by <span className="text-warning fw-bold">XMTP</span>
      </h5>
      <textarea
        rows={4}
        onChange={(e) => setCurrentMessage(e.target.value)}
        value={currentMessage}
        type="text"
        className="bg-dark text-white form-control"
      />
      <div className="btn btn-dark mt-2" onClick={() => sendMessage()}>
        Send Message
      </div>

      <div className="card card-body bg-dark text-light mt-4 text-start">
        Hi, what help do you need?
      </div>
      <div className="card card-body bg-dark text-light mt-4 text-start">
        BTC price has been fluctuating lately, buying the capitulation isn't a
        rough call but it's a very rough call to figure out what to do aside
        holding. Most people don't understand how the space works. Your
        advantage is understanding, charts won't guarantee w
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
