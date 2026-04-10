# News Maker Dapp

A hybrid distributed application for creating and sharing news!

Note that this is a demo tool and would require enterprise level IPFS storage and a real blockchain network to work in a real-world setting.

## Key features
- Utilises Web3 technologies and blockchain.
-  Articles are created and owned by the creator.
-  Transparent voting system. User's of the Dapp decided the trustworthiness, or lack thereof, of the articles.
-  No central ownership. Once an article is committed to blockchain, it becomes immutable (it can be soft-deleted but the content is effectively unchanged).
-  Furthering the point above, no censorship due to no central ownership.

## How does the Dapp work?
The Dapp is composed of three main components:
- Backend server handles safe storage and utilisation of Pinata API keys and passes JSON data (published articles) to Pinata's IPFS storage nodes via their gateway. The CID is returned.
- A smart contract written in Solidity. Defines the operations for reading and writing article metadata on-chain.
- React Frontend acts as the UI, enables Web3 Crypo-wallet connection, and communicates to the backend server and blockchain network.

The decentralised nature of the Dapp comes from two sources:
- The blockchain network which stores the article metadata.
- Pinata's IPFS distributed storage node network.

The hybrid part of the Dapp is the requirement of the backend server for the publishing of articles. All over operations such as viewing and voting can be done without the server. The publishing of articles requires the use of the Pinata API keys. These should not be exposed on the frontend and are thus stored in the backend.

## Prerequisites
- Recommend using Node 22+.
- Pinata cloud account: https://pinata.cloud/
- Pinata API keys (API Key and API Secret Key).
- IMPORTANT! Ensure 'pinJSONToIPFS' permission is set during keys creation, other settings are optional. Keep these keys safe and do not expose them.
- Install Ganache: https://archive.trufflesuite.com/ganache/
- Install MetaMask: https://metamask.io/en-GB/download
- Create a MetaMask account.

## Setup tutorial
Ensure all prerequisites are met before continuing.

Clone the repository:
```
git clone https://github.com/AntDBuck/Dapp_Project
```

### Backend
1. Move into the backend directory.
2. Install the dependencies:
```
npm install
```
3. Open the .env-empty file and copy and paste your Pinata API key and Secret key into their respective fields (ensure there are no spaces).
4. Rename the .env-empty file to .env
5. Start the backend server:
```
npm start
```

### Frontend
1. Move into the frontend directory.
2. Install the dependencies:
```
npm install
```
3. Start the React app:
```
npm run dev
```
4. Once the app is running, type o and press ENTER.

### Ganache and MetaMask
1. Open Ganache and create a network using either quick start or new workspace.
2. Log into your MetaMask account, go to settings, click 'Networks', and click 'Add a custom network'.
3. Populate the custom network inputs:
   - 'Network name' can be anything.
   - Set 'Default RPC URL' to 127.0.0.1:7545
   - Set 'Chain ID' to 1337
   - Set 'Currency symbol' to ETH
4. Go back to Ganache and copy a private key from one of the accounts.
5. On MetaMask, click accounts, click 'Add wallet', and then click 'Import an account'.
6. Paste the private key and press 'Import'.
7. Connect to the Dapp when prompted.

## End
Please feel free to fork this repository and make your own changes/improvements.

Thank you for reading!
