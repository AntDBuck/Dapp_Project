import React, { useState, useEffect } from 'react';
import { HashRouter, Switch, Route } from "react-router-dom";
import Web3 from 'web3';
import NewsMakerDapp from './abis/NewsMakerDapp.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import './components/App.css';
import Header from './components/Header';
import Main from './components/Main';
import UploadFile from './components/UploadFile';
import NotConnected from './components/NotConnected';
import AppRoutes from './AppRoutes';

function App() 
{
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
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
          setSuccessMsg('Blockchain loaded!');
        }
        catch(err)
        {
          setErrorMsg('Error! Could not connect to blockchain!');
          setLoading(false);
          setConnected(false);
        }
      }
      else 
      {
        setErrorMsg('Browser not connected!');
        setLoading(false);
        setConnected(false);
      }
    }
  }, []
  );
   
  const loadBlockchainData = async () => 
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
      setLoading(false);
    } 
    else 
    {
      setErrorMsg('Error! Can not get smart contract!');
      setConnected(false);
    }
  };

  // async loadMyAllFiles() {
  //   this.setState({ allFiles: [] })
  //   const totalFilesCount = await this.state.ourStorageDapp.methods.getTotalFileCount().call();
  //   for (let i = totalFilesCount; i >= 1; i--) {
  //     const file = await this.state.ourStorageDapp.methods.getFileOf(i).call();
  //     if (file.fileName !== "0deleted_") {
  //       this.setState({ allFiles: [...this.state.allFiles, file] })
  //     }
  //   }
  // }

  // async deleteFile(_id) {
  //   this.setState({ loading: true })
  //   this.state.ourStorageDapp.methods.deleteFile(_id)
  //     .send({ from: this.state.account })
  //     .on('confirmation', async () => {
  //       await this.loadMyAllFiles();
  //       this.setState({ loading: false })
  //     })
  //     .on('error', (error) => {
  //       console.error(error);
  //       this.setState({ loading: false })
  //     });
  // }

  // captureFile(event) {
  //   event.preventDefault()
  //   const file = event.target.files[0]
  //   this.setState({ file: file, fileType: file.type })
  //   this.setValues(file.name, this.convertBytes(file.size))
  // }

  // setValues(_name, _size) {
  //   const fileNameBox = document.getElementById('fileNameBox');
  //   const fileTypeBox = document.getElementById('fileTypeBox');
  //   const fileSizeBox = document.getElementById('fileSizeBox');

  //   fileNameBox.value = _name;
  //   fileTypeBox.value = this.state.fileType;
  //   fileSizeBox.value = _size;
  //   this.setState({ showFileDetails: true })
  // }

  // async uploadFile(_name, _des) {
  //   if (!this.state.file) {
  //     alert("Please select a file first");
  //     return;
  //   }

  //   this.setState({ loading: true });
  //   try {
  //     const formData = new FormData();
  //     formData.append('article', this.state.file);

  //     const response = await fetch('http://localhost:5000/upload', {
  //       method: 'POST',
  //       body: formData
  //     });

  //     const data = await response.json();
  //     const ipfsHash = data.cid;
      

  //     await this.state.ourStorageDapp.methods.uploadFile(
  //       ipfsHash,
  //       this.state.file.size,
  //       this.state.fileType,
  //       _name,
  //       _des
  //     ).send({ from: this.state.account })
  //       .on('confirmation', async () => {
  //         await this.loadMyAllFiles();
  //         this.setState({ loading: false, file: null, showFileDetails: false });
  //       });

  //   } catch (err) {
  //     console.error('Upload failed:', err);
  //     this.setState({ loading: false });
  //   }
  // }

  // convertBytes(bytes) {
  //   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  //   if (bytes === 0) return '0 Byte';
  //   const i = Math.floor(Math.log(bytes) / Math.log(1024));
  //   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  // // }

  //   <Main account={account} allFiles={this.state.allFiles} deleteFile={this.deleteFile} />
  //   <UploadFile account={this.state.account} uploadFile={this.uploadFile} captureFile={this.captureFile} showFileDetails={this.state.showFileDetails} />

  // return (
  //   <HashRouter>
  //     <div>
  //       {
  //         !connected
  //           ? 
  //             <>
  //               <Navbar account={account} />
  //               {
  //                 loading ? 
  //                   <div className="text-center m-5">
  //                     <div className="spinner-border bg-light m-auto" role="status"></div>
  //                   </div>
  //                 :
  //                 <Switch>
  //                     <Route path="/" exact>
  //                     </Route>
  //                     <Route path="/uploadfiles" exact>
  //                     </Route>
  //                 </Switch>
  //               }
  //             </> 
  //           : 
  //             <NotConnected />
  //       }
  //     </div>
  //   </HashRouter>
  // );

  return (
    <HashRouter>
      {<>!connected ? <NotConnected /> : 
      <Header account={account} />
      <main>
        <AppRoutes />
      </main>
      </>
      }
    </HashRouter>
  );

};

export default App;