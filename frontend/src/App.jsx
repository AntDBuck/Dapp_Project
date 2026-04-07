import { useState, useEffect } from 'react';
import { HashRouter } from "react-router-dom";

import Web3 from 'web3';
import NewsMakerDapp from './abis/NewsMakerDapp.json';

import Header from './components/Header';
import AppRoutes from './AppRoutes';
import NotConnected from './components/NotConnected';

import './styles/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Main App functional component.
 * Features:
 * - Ties the whole application together via the rendering of app routing.
 * - Smart contract is loaded.
 * - MetaMask account connection.
 * @component
 * @returns {JSX.Element} The Rendered App component.
 */
function App()
{
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [connected, setConnected] = useState(false);
  
  useEffect(() => 
  {
    /**
     * Create a Web3 instance and passes it down to loadBlockchainData function 
     * so that MetaMask account connection can be established and blockchain data 
     * can be loaded.
     */
    const loadWeb3 = async () =>
    {
      if (window.ethereum)
      {
        try 
        {
          const web3 = new Web3(window.ethereum);
          await loadBlockchainData(web3);
        }
        catch(err)
        {
          console.log('Could not connect account:', err);
          setConnected(false);
        }
      }
      else 
      {
        setConnected(false);
      }
    };
    loadWeb3();
  }, []
  );
   
  /**
   * Handles the MetaMask account connection, gets network ID, and loads smart contract.
   * @param {Web3} web3 The Web3 instance.
   */
  const loadBlockchainData = async (web3) => 
  {
    try
    {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId()
      const newsMakerData = NewsMakerDapp.networks[networkId]

      if (newsMakerData) 
      {
        const newsMakerDapp = new web3.eth.Contract(NewsMakerDapp.abi, newsMakerData.address);
        setContract(newsMakerDapp);
        setConnected(true);
      } 
      else 
      {
        setConnected(false);
      }
    }
    catch (err)
    {
      console.error('Error, blockchain failed to load:', err);
      setConnected(false);
    }
  };

  return (
    <HashRouter>
      {
        !connected ? <NotConnected /> :
        <>
          <Header account={account} />
          <main>
            <AppRoutes contract={contract} account={account} />
          </main>
        </>
      }
    </HashRouter>
  );
};

export default App;