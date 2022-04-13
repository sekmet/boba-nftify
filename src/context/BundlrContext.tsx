import {createContext, useEffect, useState} from 'react';
import { ethers } from 'ethers';
import { useEthers } from '@usedappify/core';
// import WebBundlr
import { WebBundlr } from "@bundlr-network/client";

declare let window: any // TODO: specifically extend type to valid injected objects.


/*const connData = fetchData().then(( res ) => {
let bundlr, bundlr_boba, library, currency = {};
if (res !== 'undefined'){
const { bundlr, bundlr_boba, library, currency } = res;
//console.log({ bundlr, bundlr_boba, library, currency })
} 

return {
  bundler: bundlr,
  bundlerBoba: bundlr_boba,
  library: library, 
  currency: currency,
  setBundler: () => {},
  setBundlerAddress: () => {},
  setBundlerBoba: () => {}
};

})*/

export const BundlrContext = createContext({});

function BundlrContextProvider (props:any) {
  const [bundler, setBundler] = useState<WebBundlr>();
  const [bundlerBoba, setBundlerBoba] = useState<WebBundlr>();  
  const [bundlerAddress, setBundlerAddress] = useState<string>();
  const [currency, setCurrency] = useState<string>();
  const [library, setLibrary] = useState<any>();
  const { account } = useEthers();

  useEffect(() => {
  const fetchData = async () => {

    if (typeof window === 'undefined') return;
  
    const bundlerHttpAddress = "https://devnet.bundlr.network";
    const library = new ethers.providers.Web3Provider(window.ethereum, 'any');
    const currency = 'boba-eth';
    console.log('window.ethereum ======================= ', library)
  
    if (library && library?._network?.chainId !== 28) {
      // If not connected to boba, request network switch
      await library.send("wallet_switchEthereumChain", [{ chainId: "0x1C" }]);
    }
  
    //const provider = new ethers.providers.Web3Provider(window.ethereum);
    await library && library._ready()    
  
    if (!bundlerHttpAddress) return;
    //const bundlr = new BundlrBobaClient(bundlerHttpAddress, library);
    //console.log(bundlerHttpAddress, currency, library)
    
    const bundlr = new WebBundlr(bundlerHttpAddress, currency, library,{ 
      providerUrl: "https://rinkeby.boba.network/",
      //contractAddress: "0x853758425e953739F5438fd6fd0Efe04A477b039"
    });
    await bundlr.ready();
  
    const bundlr_boba = new WebBundlr(bundlerHttpAddress, 'boba', library,{ 
      providerUrl: "https://rinkeby.boba.network/",
      //contractAddress: "0x853758425e953739F5438fd6fd0Efe04A477b039"
    });
    await bundlr_boba.ready();
  
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
      setBundlerBoba(bundlr_boba);
      setLibrary(library);
      setCurrency(currency);
      
      //localStorage.setItem('bundler', currency);
      // setBundlerUpload(bundlrUpload);
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