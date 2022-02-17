import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import {contractABI, contractAddress} from "../utilities/constants";
export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
}

export const TransactionProvider = ({ children }) => {
    const [ currentAccount, setCurrentAccount ] = useState();
    const [formData, setFormData ] = useState({ address: '', amount: '', keyword: '', message: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const handleChange = (e, name) => {
        setFormData((prevState) => ({...prevState, [name]: e.target.value }));
    }   
    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert("Please install Metamask!");
            const accounts = await ethereum.request({ method: 'eth_accounts'});
            setCurrentAccount(accounts[0]); 
            
        } catch(error) {
            console.log("No accounts connected");
        }
    }

    const connectWallet = async() => {
        try {
            if(!ethereum) return alert("Please install Metamask!");
            const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
            setCurrentAccount(accounts[0]);
        } catch(error) {
            console.log(error);
            throw new error("No ethereum connected!");
        }
    };

    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert("Please install Metamask!");
            const { address, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);
            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: address,
                    gas: '0x5208',
                    value: parsedAmount._hex,
                }]
            });

            const transactionHash = await transactionContract.addToBlockchain(address, parsedAmount, message, keyword);
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);
            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());

        } catch(error) {
            console.log(error);
            throw new error("No ethereum connected!");
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);
    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction }}>
            {children}
        </TransactionContext.Provider>
    )
}

