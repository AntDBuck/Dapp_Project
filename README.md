# News Maker Dapp

A hybrid distributed application for creating and sharing news!

* Note that this is a demo tool and would require enterprise level IPFS storage and a real blockchain network to work in a real-world setting.

========================
      Key Features
========================
- Utilises Web3 technologies and blockchain.
-  Articles are created and owned by the creator.
-  Transparent voting system. User's of the Dapp decided the trustworthiness, or lack thereof, of the articles.
-  No central ownership. Once an article is commited to blockchain, it becomes immutable (it can be soft-deleted but the content is effectively unchanged).
-  Futhering the point above, no censorship due to no central ownership.

==================================
     How does the Dapp work?
==================================
The Dapp is composed of three main components:
- Backend server handles safe storage and utilisation of Pinata API keys and passes JSON data (published articles) to Pinata's IPFS storage nodes via their gateway. The CID is returned.
- A smart contract written in Solidity. Defines the operations for reading and writing article metadata on-chain.
- React Frontend acts as the UI, enables Web3 Crypo-wallet connection, and communicates to the backend server and blockchain network.

The decentralised nature of the Dapp comes from two sources:
- The blockchain network which stores the article metadata.
- Pinata's IPFS distributed storage node network.

The hybrid part of the Dapp is the requirement of the backend server for the publishing of articles. All over operations such as viewing and voting can be done without the server. The publishing of articles requires the use of the Pinata API keys. These should not be exposed on the frontend and are thus stored in the backend.

=========================
      Prerequisites
=========================
- Pinata cloud account: https://pinata.cloud/
- Pinata API keys (API Key and API Secret Key).
- IMPORTANT! Ensure 'pinJSONToIPFS' permission is set during keys creation, other settings are optional. Keep these keys safe and do not expose them.
- Install Ganache: https://archive.trufflesuite.com/ganache/
- Install MetaMask: https://metamask.io/en-GB/download

