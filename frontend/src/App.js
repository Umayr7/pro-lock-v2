import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React, { Fragment, useEffect, useState, useContext } from 'react';
import { ethers } from 'ethers'
import { requestAccount } from './functions/requestAccount';
import { getContractDetails } from './functions/getContractDetails';

import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import AddProperty from './components/AddProperty';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Properties from './components/Properties';
import Profile from './components/Profile';
import { UserState } from './context/user/UserState';
import setAuthToken from './utils/setAuthToken';
import PropertyDetails from './components/PropertyDetails';

if(localStorage.token) {
  setAuthToken(localStorage.token); 
}

const App = () => {
  // State variables
  const [mounted, setMounted] = useState(false);
  const [properties,setProperties] = useState([]);
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();
  const [address, setAddress] = useState();
  const [balance, setBalance] = useState();


  useEffect(() => {

    loadState();

    // eslint-disable-next-line
  }, [mounted, address]);

  const loadState = async () => {

    // request access to the user's MetaMask account
    await requestAccount();

    const contractDetails = await getContractDetails();
    setProvider(contractDetails[0]);
    setSigner(contractDetails[1]);
    setContract(contractDetails[2]);
    setAddress(contractDetails[3]);
    setBalance(contractDetails[4]);

    if (address) {
      await getAllProperties(contract);
    }
  };

  const getAllProperties = async (contract) => {
    setProperties([]);
    const count = await contract.propertyCount();
    for(var i = 1;i<=count; i++){
      const property = await contract.properties(i);

      let ipfsData = await contract.tokenURI(i);
      const response = await fetch(ipfsData);
      const metaData = await response.json();
      if (property.isAvailable) {
        let propertyData = {
          location: metaData.location,
          image: metaData.image,
          size: metaData.size,
          price: ethers.BigNumber.from(property.price),
          owner: property.owner,
          isAvailable: property.isAvailable,
          tokenId: i,
          description: metaData.description
        };
        setProperties(properties => [...properties, propertyData]);
      }
    }
  };

  return (
    <UserState>
      <Router>
        <Fragment>
          <Header contract = {contract} signer = {signer} address = {address} balance = { balance }  />
          <Routes>
            <Route exact path="/" element={ <> <Home contract = {contract} setMounted={setMounted} mounted = {mounted} properties = {properties.slice(0, 4)} getAllProperties={getAllProperties}/>  </>} />
            <Route path="/login" element={ <Login contract = {contract} address = {address} />} />
            <Route path="/all-properties" element={ <Properties contract = {contract} properties= {properties} mounted={mounted} balance = { balance } getAllProperties={getAllProperties} /> } />
            <Route path="/register" element={ <Register contract = {contract} address = {address} /> } />
            <Route path="/add-property" element={ <AddProperty setMounted={setMounted} mounted={mounted} contract={contract} /> } />
            <Route path="/profile" element={ <Profile contract = {contract} address = {address} mounted={mounted} setMounted={setMounted} balance = { balance } getAllProperties={getAllProperties} /> } />
            <Route path="/property-details" element={ <PropertyDetails contract = {contract} address={address} properties= {properties} /> } />
          </Routes>
          <Footer/>
        </Fragment>
      </Router>
    </ UserState>
  );
}

export default App;
