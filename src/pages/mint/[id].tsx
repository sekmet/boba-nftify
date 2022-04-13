import { useEffect, useState, useContext } from 'react';

// import Link from 'next/link';
import { Interface } from '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import { useEthers } from '@usedappify/core';
import { GetStaticProps, GetStaticPaths } from 'next';
import prettyBytes from 'pretty-bytes';
// import { classNames } from '@/utils';
import { useForm } from 'react-hook-form';

import { Alert } from '@/components/Alerts';
import Identicon from '@/components/Wallet/Identicon';
import { BundlrContext } from '@/context/BundlrContext';
import { Dashboard } from '@/layouts/Dashboard';
import { Meta } from '@/layouts/Meta';
import erc721abi from '@/lib/abis/erc721.json';
import { getDatabase, getFilesByID } from '@/utils/db';

declare let window: any; // TODO: specifically extend type to valid injected objects.
let currentFile = {
  name: '',
  size: 0,
  link: '',
  mimeType: '',
};

const contractURI = (
  name: string,
  description: string,
  image: string,
  animation_url: string,
  external_url: string,
  sha256: string
) => `{
  "name": "${name || ''}",
  "description": "${description || ''}",
  "image": "${image}",
  "animation_url": "${animation_url || ''}",
  "external_url": "${external_url || ''}",
  "sha256": "${sha256 || ''}"
}
`;

const Index = (props: any) => {
  // const router = useRouter();
  const { bundler /* , bundlerBoba */ } = useContext<any>(BundlrContext);
  const { account } = useEthers();
  const [provider, setProvider] = useState<any>();
  const [signer, setSigner] = useState<any>();
  const [tokenid, setTokenId] = useState<any>();
  const [chainId, setChainId] = useState<any>();
  // const [network_name, setNetworkName] = useState<string | undefined>();
  const [ownerAddress, setOwner] = useState<any>();
  // const [tokenURI, setContractUri] = useState<string | undefined>();
  const [tokenContract, setTokenContract] = useState<string | undefined>();
  // const [minting, setMinting] = useState<undefined | boolean>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  console.log(errors);
  const abi = new Interface(erc721abi);
  // This can be an address or an ENS name
  const address =
    process.env.NFT721_CONTRACT_ADDRESS ||
    '0x929B283D2f0B86D9CBEb50f30DbA7585dD9733B8'; // "0xA03dc0FAa9e3b76f92D5d340c62F9969e221bdbC";

  // const [DB, setDb] = useState<any>();
  const [currentfile, setCurrentFile] = useState<any>();
  const { id } = props;

  let erc721: any = {};
  if (address && abi && provider) {
    erc721 = new Contract(address, abi, provider);
    erc721.currentTokenId().then(function (result: any) {
      console.log('Token ID ===> ', result, chainId);
      if (result) {
        const resultPlus = BigNumber.from(result).toNumber() + 1;
        console.log('Token ID dec ===> ', resultPlus);
        setTokenId(resultPlus);
        // setId(_result);
      }
      return result;
    });
  }

  const getJsonFile = (
    name: string,
    description: string,
    image: string,
    animation_url: string,
    external_url: string,
    sha256: string
  ) => {
    // const file = new Blob([contractURI(name, description, image, animation_url, external_url, sha256)], { name: "contractURI.json", type: 'application/json' })
    // console.log(contractURI(name, description, image, animation_url, external_url, sha256), file)
    return contractURI(
      name,
      description,
      image,
      animation_url,
      external_url,
      sha256
    );
  };

  const uploadFile = async (
    name: string,
    description: string,
    image: string,
    animation_url: string,
    external_url: string,
    sha256: string
  ) => {
    const json = await getJsonFile(
      name,
      description,
      image,
      animation_url,
      external_url,
      sha256
    );

    if (json) {
      console.log('Uploading contractUri file', json);
      Alert(
        'info',
        'Uploading file...',
        'Uploading ContractURI file, please wait...'
      );
      const res = await bundler?.uploader?.upload(json, [
        { name: 'Content-Type', value: 'application/json' },
      ]);
      console.log(res);
      console.log({
        status:
          res?.status === 200 || res?.status === 201 ? 'success' : 'error',
        title:
          res?.status === 200 || res?.status === 201
            ? 'Successful!'
            : `Unsuccessful! ${res?.status}`,
        description: res?.data.id
          ? `https://arweave.net/${res.data.id}`
          : undefined,
        duration: 15000,
      });
      Alert(
        'success',
        'ContractURI saved!',
        'ContractURI file uploaded with success!'
      );
      // setContractUri(`https://arweave.net/${res.data.id}`);
      return `https://arweave.net/${res.data.id}`;
    }

    return false;
  };

  const mintNFT = async (
    tokenAddress: any,
    tokenUri: string,
    tokenName: string,
    tokenDescription: string
  ) => {
    // let requestAccounts;
    // let userAddress;

    /* if (typeof provider !== 'undefined' && typeof signer !== 'undefined') {
        let requestAccounts = await provider.send('eth_requestAccounts', []);
        let userAddress = await signer.getAddress();
        console.log(`Your wallet is ${userAddress}`);
      } */

    // Read-Write; By connecting to a Signer, allows:
    // - Everything from Read-Only (except as Signer, not anonymous)
    // - Sending transactions for non-constant functions
    console.log('Contract => ', tokenAddress, abi, signer);
    const erc721rw = new Contract(tokenAddress, abi, signer);

    erc721rw.createToken(tokenUri).then(async function (tx: any) {
      // setMinting(true);
      console.log('Chain ID: ', chainId);
      console.log('Transaction: ', tx);
      Alert('info', 'Minting...', 'Wait for the transaction to be mined...');
      console.log('Wait for the transaction to be mined...');
      await tx.wait();
      console.log('Transaction mined!', signer);
      Alert('success', 'Transaction mined!', signer);
      // Get the token ID
      // const tokenId = await erc721rw.tokenOfOwnerByIndex(ownerAddress, 0);
      console.log('Token ID: ', tokenid.toString());
      // Get the token URI
      /*          const tokenURI = await erc721.tokenURI(tokenId);
                console.log("Token URI: ", tokenURI);
                // Get the token name
                const tokenName = await erc721.name(tokenId);
                console.log("Token Name: ", tokenName);
                // Get the token description
                const tokenDescription = await erc721.tokenURI(tokenId);
                console.log("Token Description: ", tokenDescription);
                // Get the token owner
                const tokenOwner = await erc721.ownerOf(tokenId);
                console.log("Token Owner: ", tokenOwner); */
      // Get the token balance
      const tokenBalance = await erc721.balanceOf(ownerAddress);
      console.log('Token Balance: ', tokenBalance);
      Alert('info', 'Token Balance', tokenBalance);

      Alert(
        'success',
        `Token Minted!`,
        `${tokenName} - Contract Address: ${tokenAddress} and Token ID: [ ${tokenid.toString()} ]`
      );
      /* const itemData: IItemData = {
          network: network_name,
          token_id: tokenid,
          owner_address: `${ownerAddress}`.toLowerCase(),
          chainId,
          //collection_id: random_id,
          contract_address: address,
        };
  
        console.log('Item Data: ', itemData);
        */
      // await submitItem(itemData, router, ownerAddress, chainId);
    });

    console.log(tokenName, tokenDescription);
    // setMinting(false);
  };

  const onSubmit = (data: any) => {
    uploadFile(
      data?.nft_name,
      data?.nft_description,
      currentfile?.link,
      '',
      data?.nft_external_url,
      ''
    ).then((tokenUriNft: any) => {
      mintNFT(tokenContract, tokenUriNft, 'NfifyV1', 'Nftify v1.0 nft');
    });
  };

  useEffect(() => {
    const db = getDatabase(window.localStorage);
    // setDb(db)
    // const cfiles = getFiles(getDatabase(window.localStorage));
    const selectedFile = getFilesByID(db, id); // getFilesByName(db, cfiles[0].name)
    if (!currentfile) setCurrentFile(selectedFile[0]);

    // Connect to the Ethereum network
    const providerEth = new Web3Provider(window.ethereum, 'any');
    setProvider(providerEth);
    (async function () {
      await providerEth.send('eth_requestAccounts', []);
      const signerEth = providerEth.getSigner();
      setSigner(signerEth);
      const userAddress = await signerEth.getAddress();
      console.log(`Your wallet is ${userAddress}`);
      setOwner(userAddress);
      const network = await providerEth.getNetwork();
      // setNetworkName(name);
      setChainId(network?.chainId);
      setTokenContract(address);
    })();
  }, []);

  console.log(currentfile);
  currentFile = currentfile || currentFile;
  return (
    <Dashboard
      auth={true}
      meta={
        <Meta
          title="Mint NFT - Boba Network"
          description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
        />
      }
    >
      <div className="md:grid md:grid-cols-8 md:gap-6">
        <div className="md:col-span-5">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Mint NFT (ERC721)
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>
            {currentFile && (
              <div className="py-3 px-4 mt-6">
                {[
                  'video/mp4',
                  'video/ogg',
                  'video/x-msvideo',
                  'video/quicktime',
                ].includes(currentFile.mimeType) && (
                  <div className="block overflow-hidden w-full rounded-lg aspect-w-10 aspect-h-7">
                    <video
                      controls
                      className="object-cover object-center w-full"
                      loop
                    >
                      <source
                        type={currentFile?.mimeType}
                        src={
                          currentFile.link
                            ? currentFile.link
                            : '/assets/images/placeholder.png'
                        }
                      />
                      Sorry, your browser doesnt support embedded videos.
                    </video>
                  </div>
                )}
                {['audio/mpeg', 'audio/ogg', 'audio/wav'].includes(
                  currentFile.mimeType
                ) && (
                  <div className="block overflow-hidden rounded-lg">
                    <audio controls className="w-full" loop>
                      <source
                        type={currentFile?.mimeType}
                        src={
                          currentFile.link
                            ? currentFile.link
                            : '/assets/images/placeholder.png'
                        }
                      />
                      Sorry, your browser doesnt support embedded audios.
                    </audio>
                  </div>
                )}
                {['image/png', 'image/jpeg', 'image/gif', null].includes(
                  currentFile.mimeType
                ) && (
                  <div className="block overflow-hidden w-full text-center rounded-lg">
                    <img
                      className="w-192"
                      src={
                        currentFile.link
                          ? currentFile.link
                          : '/assets/images/placeholder.png'
                      }
                      alt={currentFile.name}
                    />
                  </div>
                )}

                <div className="flex justify-between items-start mt-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      <span className="sr-only">Details for </span>
                      {currentFile.name}
                    </h2>
                    <p className="text-sm font-medium text-gray-500">
                      {prettyBytes(currentFile.size)}
                    </p>
                  </div>
                  {/* <button
                      type="button"
                      className="ml-4 bg-white rounded-full h-8 w-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <HeartIcon className="h-6 w-6" aria-hidden="true" />
                      <span className="sr-only">Favorite</span>
                    </button> */}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="py-3 px-4 mt-5 md:col-span-3 md:mt-0">
          <aside className="overflow-y-auto p-8 w-96 bg-white rounded-lg border border-gray-200 lg:block">
            <div className="pb-16 space-y-6">
              {/* <div>
                  <div className="block w-full rounded-lg overflow-hidden">
                    <img src={currentFile.link} alt={currentFile.name} />
                  </div>
                  <div className="mt-4 flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        <span className="sr-only">Details for </span>
                        {currentFile.name}
                      </h2>
                      <p className="text-sm font-medium text-gray-500">{prettyBytes(currentFile.size)}</p>
                    </div>
                  </div>
                  </div> */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Token Information
                  </h3>
                  <dl className="mt-2 border-y border-gray-200 divide-y divide-gray-200">
                    <div className=" py-3 bg-white">
                      <label
                        htmlFor="nft-name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <input
                          type="text"
                          id="nft-name"
                          className="block flex-1 w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="NFT Name"
                          {...register('nft_name', {
                            required: true,
                            maxLength: 90,
                          })}
                        />
                      </div>
                    </div>

                    <div className=" py-3 bg-white">
                      <label
                        htmlFor="about"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          {...register('nft_description', {})}
                          rows={3}
                          className="block mt-1 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm sm:text-sm"
                          placeholder="you@example.com"
                          defaultValue={''}
                        />
                      </div>
                    </div>

                    <div className=" py-3 bg-white">
                      <label
                        htmlFor="company-website"
                        className="block text-sm font-medium text-gray-700"
                      >
                        External URL
                      </label>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 rounded-l-md border border-r-0 border-gray-300">
                          https://
                        </span>
                        <input
                          type="text"
                          {...register('nft_external_url', {})}
                          id="nft_external_url"
                          className="block flex-1 w-full rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="www.example.com"
                        />
                      </div>
                    </div>
                  </dl>
                </div>
                {/* <div className="flex">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 w-full text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
                  >
                    Save Information
                  </button>
                        </div> */}

                <div className="mt-3">
                  <h3 className="font-medium text-gray-900">Owner</h3>
                  <ul
                    role="list"
                    className="mt-2 border-y border-gray-200 divide-y divide-gray-200"
                  >
                    <li className="flex justify-between items-center py-3">
                      <div className="flex items-center">
                        <span className="w-8 h-8 rounded-full">
                          <Identicon accountId={account} iconSize={32} />
                        </span>
                        <p className="ml-2 text-xs font-medium text-gray-900">
                          {account}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="flex mt-6">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 w-full text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm"
                  >
                    Mint NFT (ERC721)
                  </button>
                </div>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </Dashboard>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id }: any = params;
  return {
    props: { id }, // will be passed to the page component as props
  };
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], // indicates that no page needs be created at build time
    fallback: 'blocking', // indicates the type of fallback
  };
};

export default Index;
