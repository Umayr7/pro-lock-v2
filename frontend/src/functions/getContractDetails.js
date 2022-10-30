import { ethers } from 'ethers'
import RealEstate from '../abis/RealEstate.json';
import realEstate from '../abis/RealEstate-address.json';

export const getContractDetails = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(realEstate.address, RealEstate.contractArtifact.abi, signer);
    const address = await signer.getAddress();
    let balance = await provider.getBalance(address);
    balance = ethers.utils.formatEther( balance ).toString()

    return [provider, signer, contract, address, balance];
};