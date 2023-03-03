import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { ethers } from "ethers";

export const providerOptions = {
  walletlink: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "Apex", // Required
      infuraId: "https://mainnet.infura.io/v3/e1dc139bc3d6452eb46e47b13ba4b264", // Required unless you provide a JSON RPC url; see `rpc` below
      chainId: 1,
    }
  },
  walletconnect: {
    package: WalletConnect, // required
    options: {
      infuraId: "https://mainnet.infura.io/v3/e1dc139bc3d6452eb46e47b13ba4b264" // required
    }
  },
  injected: {
    package: ethers
  }
};
