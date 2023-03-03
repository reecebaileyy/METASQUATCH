import React, {useEffect} from "react";
import "./MetasquatchDapp.css";
import {Addresses, ABIs} from "./contracts/contracts";
import 'regenerator-runtime/runtime';

function MetasquatchDapp(props) {
  
  let provider, 
  address, 
  signer, 
  tokenContract, 
  msContract, 
  minisContract, 
  rpContract, 
  landContract, 
  playContract, 
  yourReward, 
  yourSquatches, 
  yourLand;

  useEffect(async () => {
    const ethers = require("ethers");
    
    //Get signer & provider
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    //Contract Addresses
    tokenContract = new ethers.Contract(Addresses.tokenAddress, ABIs.tokenABI, signer);
    landContract = new ethers.Contract(Addresses.landAddress, ABIs.landABI, signer);
    rpContract = new ethers.Contract(Addresses.rpAddress, ABIs.rpABI, signer);
    msContract = new ethers.Contract(Addresses.msAddress, ABIs.msABI, signer);
    minisContract = new ethers.Contract(Addresses.minisAddress, ABIs.minisABI, signer);

    //Grab HTML Elements
    const connectBtn = document.getElementById("connect");
    const breedBtn = document.getElementById("breed");
    const rewards = document.getElementById("rewards");
    const yourSquatches = document.getElementById("squatches");
    const yourLand = document.getElementById("land");
    const canMint = document.getElementById("canMint");
    const claimBtn = document.getElementById("claim");

    //Address
    
    address = window.localStorage.getItem('address')
    
    //Gas Prices
    window.mintGas = await minisContract.estimateGas.mint().catch((err) => {console.log(err)})
    window.approveGas = await msContract.estimateGas.setApprovalForAll(address, Addresses.minisAddress).catch((err) => {console.log(err)})
    
    //Connect to wallet
    const connect = async () => {
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // chainId must be in hexadecimal numbers
      });
      window.ethereum.request({method: 'eth_requestAccounts'})
          .then((response) => {
              console.log(response)
              window.localStorage.setItem('address', response[0]);
              
              var button = document.getElementById("connect")
              button.innerHTML = "Connected"
              info()            
          })
          .then(() => {
            msContract.isApprovedForAll(address, Addresses.minisAddress)
            .then((isApproved) => {
              if(!isApproved){
                const value = "0.0";
                msContract.setApprovalForAll(Addresses.minisAddress, true,{
                value:ethers.utils.parseEther(value),
                gasLimit: window.approveGas
              })
              }
            })            
          })
          .catch((error) => {
              alert('An error occurred, kindly check the console for details');
              console.log(error);
          })
    }

    //Mint Function
    const breed = async () => {
      const value = "0.0";
        minisContract.mint({
          value:ethers.utils.parseEther(value),
          gasLimit: window.mintGas
        })
        .catch((error) => {
          alert('Failed to mint the Yeti.');
          console.log(error);
        })
        
    }

    //Claim Reward
    const claimReward = async () => {
      
      const value = "0.0";
      const tokenID = document.getElementById("tokenID").value;
      const owner = await minisContract.ownerOf(tokenID).catch((err) => {
        alert('Please enter a valid token ID number that you own.')
        console.log(err)
      })
      console.log(owner.toLowerCase(), window.localStorage.getItem('address').toLowerCase())

      if(owner.toLowerCase() == window.localStorage.getItem('address').toLowerCase()) {
        console.log(tokenID)
        rpContract.claimReward(tokenID, {
          value:ethers.utils.parseEther(value),
          gasLimit: 100000
        })
      }else{
        alert("You do not own this token or it does not exist.")
      }
    }


    //Update Info
    const info = () => {

      //Check Balance of Metasquatches
      msContract.balanceOf(address).then((amount) => {
        yourSquatches.innerHTML = amount
      })
      
      landContract.balanceOf(address).then((amount) => {
        yourLand.innerHTML = amount
      })
      
      let rewardAmount = 0;
      minisContract.balanceOf(address).then((nftIds) => {

        
        calcRewards()
      })

      async function calcRewards(){
        rpContract.rewardRates().then(async (amount) => {
          let amounts = parseInt(amount._hex, 16)
          let yeti = await minisContract.balanceOf(address).catch((err) => {console.log(err)})
          let yetis = parseInt(yeti._hex, 16)
          console.log("You have:", yetis, "antisquatches")
          rewardAmount += amounts * yetis
          rewards.innerHTML = rewardAmount.toFixed(2)
        })
      }

      minisContract.canMint(address).then((result) => {
        msContract.isApprovedForAll(address, Addresses.minisAddress)
        .then((isApproved) => {
          console.log(isApproved, result)
          if(isApproved && result) {
            canMint.innerHTML = result
          }else{
            canMint.innerHTML = false
          }
        })
      })
    }

    if(!window.ethereum._state.isConnected) {
      window.localStorage.setItem('connected', 'Connected')
    }else{
      window.localStorage.setItem('connected', 'Connect')
    }
    
    connectBtn.addEventListener('click', () => {
        connect();
        console.log(window.ethereum)
    });
    
    breedBtn.addEventListener('click', () => {
       breed();
    });
    
    claimBtn.addEventListener('click', () => {
       claimReward();
    });
    
    window.ethereum.on('accountsChanged', (account) => {
        window.localStorage.setItem('address', account[0]);   
        window.location.reload();
        console.log('Account changed!')
    });
    
    window.ethereum.on('chainChanged', () => {
        window.location.reload();
        console.log('Chain changed!')
    });
    
    window.ethereum.on('disconnect', () => {
        // window.location.reload();
        console.log('Account Disconnected!')
        const connectBtn = document.getElementById("connect");
        connectBtn.innerHTML = "Connect"
    });
  });


  const {
    title,
    connect,
    mslogo1,
    land,
    metasquatches,
    requires2Metasquatch1Land,
    breed,
    rewardPerMinis,
    canMint,
    website,
    discord,
    twitter,
    opensea,
    placeNum,
    forest
  } = props;

  return (
    <div className="container-center-horizontal">
      <div className="metasquatch-dapp screen">
        <div className="overlap-group7">
			<div className="logo-holder"><img className="ms-logo-1" src={mslogo1} /></div>
          	<h1 className="title">{title}</h1>
          	<div className="connectBtn btn" id="connect">
            <img className="icon" src="/img/icon@2x.svg" />
            <div className="04b-30-normal-white-24px connect" >{connect}</div>
          	</div>        
        </div>
        <div className="flex-row">
          <div className="overlap-group-container">
            <div className="overlap-group9">
            <div className="rectangle"  id="land">{placeNum}</div>
              <div className="place 04b-30-normal-black-24px">{land}</div>
            </div>
            <div className="overlap-group8">
              <div className="rectangle" id="squatches">{placeNum}</div>
              <div className="metasquatches">{metasquatches}</div>
            </div>
          </div>
          <div className="group-container">
            <div className="group-1">
              <div className="overlap-group1">
                <div className="overlap-group">
                  <div className="requires-2-metasquatch-1-land">{requires2Metasquatch1Land}</div>
                </div>
                <img className="land" id="forest" src={forest} alt="" />
              </div>
              <div className="breedBtn btn">
                <div className="breed 04b-30-normal-white-24px" id="breed">{breed}</div>
              </div>
              <div className="claimBtn btn">
                <input type="number" id="tokenID" min="1" max="300"></input>
                <div className="breed 04b-30-normal-white-24px" id="claim">Claim Rewards</div>
              </div>
            </div>
            
          </div>
          <div className="overlap-group-container-1">
            <div className="overlap-group12">
              <div className="rectangle" id="rewards">{placeNum}</div>
              <div className="reward-per-minis 04b-30-normal-black-24px">{rewardPerMinis}</div>
            </div>
            <div className="overlap-group3">
              <div className="overlap-group-1">
              <div className="rectangle" id="canMint">{placeNum}</div>
				<div className="can-mint 04b-30-normal-black-24px">{canMint}</div>
              </div>
              
            </div>
          </div>
        </div>
        
      </div>
	  <div className="overlap-group10 04b-30-normal-white-20px">
          <div className="tooltip">
              <span className="tooltiptext">🔥Coming Soon🔥</span>
              <a><div className="website">Website</div></a>
          </div>
          <a href={discord} target="_blank" rel="noopener noreferrer"><div className="footer">Discord</div></a>
          <a href={twitter} target="_blank" rel="noopener noreferrer"><div className="footer">Twitter</div></a>
          <a href={opensea} target="_blank" rel="noopener noreferrer"><div className="footer">Rarible</div></a>
        </div>
    </div>
	
  );
}

export default MetasquatchDapp;