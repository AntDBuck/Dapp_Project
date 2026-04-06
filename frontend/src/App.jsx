import { useState, useEffect } from 'react';
import { HashRouter } from "react-router-dom";

import Web3 from 'web3';
import NewsMakerDapp from './abis/NewsMakerDapp.json';

import './styles/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Header';
import AppRoutes from './AppRoutes';
import NotConnected from './components/NotConnected';

function App()
{
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [connected, setConnected] = useState(false);
  
  useEffect(() => 
  {
    const loadWeb3 = async () =>
    {
      if (window.ethereum)
      {
        try 
        {
          window.web3 = new Web3(window.ethereum);
          await loadBlockchainData();
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
   
  const loadBlockchainData = async () => 
  {
    try
    {
      const web3 = new Web3(window.ethereum);
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