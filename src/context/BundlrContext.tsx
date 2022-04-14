import {createContext, useEffect, useState} from 'react';
import { ethers } from 'ethers';
import { useEthers } from '@usedappify/core';
// import WebBundlr
import { WebBundlr } from "@bundlr-network/client";
import { useRouter } from 'next/router';

declare let window: any // TODO: specifically extend type to valid injected objects.

export const BundlrContext = createContext({});

function BundlrContextProvider (props:any) {
  const [bundler, setBundler] = useState<WebBundlr>();
  const [bundlerBoba, setBundlerBoba] = useState<WebBundlr>();  
  const [bundlerAddress, setBundlerAddress] = useState<string>();
  const [currency, setCurrency] = useState<string>();
  const [library, setLibrary] = useState<any>();
  const { account } = useEthers();
  const router = useRouter();

  useEffect(() => {
  const fetchData = async () => {

    if (typeof window === 'undefined') return;
  
    const bundlerHttpAddress = "https://devnet.bundlr.network";
    const libraryWeb3 = new ethers.providers.Web3Provider(window.ethereum, 'any');
    const currencyWeb3 = 'boba-eth';  
    /* eslint-disable no-underscore-dangle */
    if (libraryWeb3 && libraryWeb3?._network?.chainId !== 28) {
      // If not connected to boba, request network switch
      await libraryWeb3.send("wallet_switchEthereumChain", [{ chainId: "0x1C" }]);
    }
  
    //const provider = new ethers.providers.Web3Provider(window.ethereum);
    /* eslint-disable no-underscore-dangle */
    libraryWeb3 && await libraryWeb3._ready()    
  
    // if (bundlerHttpAddress === 'undefined') return;
    // const bundlr = new BundlrBobaClient(bundlerHttpAddress, library);
    // console.log(bundlerHttpAddress, currency, library)
    
    const bundlr = new WebBundlr(bundlerHttpAddress, currencyWeb3, libraryWeb3,{ 
      providerUrl: "https://rinkeby.boba.network/",
      //contractAddress: "0x853758425e953739F5438fd6fd0Efe04A477b039"
    });
    await bundlr.ready();
  
    const bundlrBoba = new WebBundlr(bundlerHttpAddress, 'boba', libraryWeb3,{ 
      providerUrl: "https://rinkeby.boba.network/",
      contractAddress: "0x122278A06753D5af91383848B13CF136F9C6f721"
    });
    await bundlrBoba.ready();
  
    try {
      // Check for valid bundlr node
      let isvalid = await bundlr.getPrice(1000);
      let balance = await bundlr.getLoadedBalance();
      console.log('balance ', balance.toString());
      console.log('is valid! ', isvalid.toString());
    } catch {
      console.log("invalid bundlr node");
      return;
    }
    /*try {
      await bundlr.connect();
    } catch (err) {
      console.log(err);
    }*/
    //@ts-ignore
    if (!bundlr.address) {
      console.log("something went wrong");
    } else {
      //console.log("connected to bundlr", bundlr, bundlr?.address);
      setBundlerAddress(bundlr?.address)
      setBundler(bundlr);
      setBundlerBoba(bundlrBoba);
      setLibrary(libraryWeb3);
      setCurrency(currencyWeb3);
      
      //localStorage.setItem('bundler', currency);
      // setBundlerUpload(bundlrUpload);
      router.push('/upload');
    }
  
  
    //return { bundlr, bundlr_boba, library, currency }
  
  }

  if (account)
    fetchData();

},[account])

  return (
    <BundlrContext.Provider value={{ bundler, bundlerAddress, bundlerBoba, library, currency }}>
      {props.children}
    </BundlrContext.Provider>
  )
}


export default BundlrContextProvider;