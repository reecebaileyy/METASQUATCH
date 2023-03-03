import { providerOptions } from "../components/Web3/Web3";
import Web3Modal from "web3modal";
import {Addresses, ABIs} from "../components/MintInput/contracts/contracts";
import {ethers} from "ethers";
import  React, {useState, useEffect, useCallback, useRef} from 'react'
import Head from 'next/head'
import * as datefns from 'date-fns'
import {Howl, Howler} from 'howler';
// import { useWaitForTransaction } from 'wagmi'

export default function Home() {
  const [chainId, setChainId] = useState();
  const [error, setError] = useState("");

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [library, setLibrary] = useState();
  const [account, setAccount] = useState(null);

  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState(false)
  
  const [approved, setApproved] = useState(false)

  const maxInt = 115792089237316195423570985008687907853269984665640564039457584007913;

  const [contracts, setContracts] = useState({
    node:null,
    token:null,
  });

  let web3Modal;
  try{
  web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions,
    theme: theme ? "light":"dark",
    network:"" // required
  });
  } catch (error) {console.log(error)}

  const connectWallet = async () => {
          try{

          const provider = await web3Modal.connect();
          const library = new ethers.providers.Web3Provider(provider, "any");
          const accounts = await library.listAccounts();
          const signers = library.getSigner(accounts[0]);
          const network = await library.getNetwork();

          const nftContract = new ethers.Contract(Addresses.nftAddress, ABIs.nftABI, signers);
          const tokenContract = new ethers.Contract(Addresses.tokenAddress, ABIs.tokenABI, signers);
          
          setContracts({
            nft: nftContract,
            token: tokenContract
          })

          setSigner(signers);
          setProvider(provider);
          setLibrary(library);
          if (accounts) setAccount(accounts[0]);
          setChainId(network.chainId);
          init()
        } catch (error) {
          setError(error);
        }
  }


  const refreshState = () => {
    try{
      setAccount();
      setChainId();
    }catch (error) {console.log("Error in refreshState", error)}
  }

  const disconnect = async () => {
    try{
      await web3Modal.clearCachedProvider();
      refreshState();
    }catch (error) {console.log("Error in Disconnect", error)}
  }

  useEffect(() => {
    try{
      if (provider?.on) {
        const handleAccountsChanged = (accounts) => {
          console.log("accountsChanged", accounts);
          console.log('Account changed!')
          if (accounts) setAccount(accounts[0])
          init()
        }
  
        const handleChainChanged = (_hexChainId) => {
          console.log('Chain changed!')
          setChainId(_hexChainId);
          init()
        }
  
        const handleDisconnect = () => {
          setConnected(false);
          console.log('Disconnected!')
          console.log("disconnect", error);
          disconnect();
          init()
        }
  
        waitFor()
  
        provider.on("accountsChanged", handleAccountsChanged);
        provider.on("chainChanged", handleChainChanged);
        provider.on("disconnect", handleDisconnect);
  
        return () => {
          if (provider.removeListener) {
            provider.removeListener("accountsChanged", handleAccountsChanged);
            provider.removeListener("chainChanged", handleChainChanged);
            provider.removeListener("disconnect", handleDisconnect);
          }
        } 
      }
    }catch (error) {console.log("Error in useEffect Account Handle", error)}
  }, [provider]);

  async function waitFor(){
    try{
      setWait(init, 2)
      setWait(getPrice, 2)
    }catch(error){console.log(err)}
  }

  async function init(){ 
    try{
      getPrice()
    }catch(e){
      console.log(error)
    }
  }

  const mint = async (e) => {
    try{
      if(account)
      {
        console.log("Mint: ", nodeAmount)
        e.preventDefault();
      
        const value = "0.0069"
        const gas = await contracts.nft.estimateGas.mint(nodeAmount, {value: ethers.utils.parseEther(value)}).catch((err) => {console.log(err)});
  
        contracts.nft.mint(nodeAmount, {
          value: BigInt(ethers.utils.parseEther(value) * nodeAmount),
          gasLimit: gas
        }).then(() => {
          setLoading(true)
          wait()
        }).catch((err) => {console.log(err)});
      }
    }catch (e) {console.log("Error in Mint "), e}
  }

  const handleChange = (value) => {
    try{
      setNodeAmount(value.target.value);
    }catch(err){console.log("Error in handleChange", err)}
  }

  const getPrice = async () => {
    try{
      if(account){
        let b = await contracts.nft.balanceOf(account)
        let balanceOf = parseInt(b, 10)
        setPrice(balance)
  
        setBalance(balanceOf.toFixed(0))
      }
    }catch(err){
      console.log(err)
    }
  }

  function wait() {
    try{
      setTimeout(function () {
        console.log("15 Seconds has passed")
        setLoading(false)
      }, 15000);
    }catch(error){console.log("Error in wait() ", error)}
  }

  function setWait(func, time){
    setTimeout(function () {
      func()
      console.log("Executed in " + time + " seconds")
    }, time * 1000);
  }
  

  const setDark = async () => {
    if(theme){
      setTheme(false)
    }else{
      setTheme(true)
    }

  }


  // const WaitTx = async (hash, func, params) => {
  //     const waitForTransaction = useWaitForTransaction({
  //     hash: hash,
  //     onSuccess(data) {
  //       console.log('Success', data)
  //       func(params)
  //     },
  //   })
  // }



  return (
    <>
      <Head>
          <title>Hot Potato</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      
      <navbar>
        
      </navbar>
    </>
  );
}
