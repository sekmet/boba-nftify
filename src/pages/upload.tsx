import { useEffect, useState, useContext } from 'react';

import { RadioGroup } from '@headlessui/react';
import {
  // PencilIcon,
  LightningBoltIcon,
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  // SearchIcon,
  // ViewGridIcon as ViewGridIconSolid,
  // ViewListIcon,
  CheckCircleIcon,
} from '@heroicons/react/solid';
import { useEthers } from '@usedappify/core';
import BigNumber from 'bignumber.js';
import * as ethers from 'ethers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import prettyBytes from 'pretty-bytes';

import { Alert } from '@/components/Alerts';
import Identicon from '@/components/Wallet/Identicon';
import { BundlrContext } from '@/context/BundlrContext';
import { Dashboard } from '@/layouts/Dashboard';
import { Meta } from '@/layouts/Meta';
// import { BundlrBobaClient } from "@sekmet/bundlr-boba-client";
// import NetworkDropdown from '@/components/Dropdowns/NetworkDropdown';
import { classNames } from '@/utils';
import { getDatabase, insertFileEntry } from '@/utils/db';

/* import {
  CogIcon,
  CollectionIcon,
  HeartIcon,
  HomeIcon,
  MenuAlt2Icon,
  PhotographIcon,
  PlusSmIcon as PlusSmIconOutline,
  UserGroupIcon,
  ViewGridIcon as ViewGridIconOutline,
  XIcon,
} from '@heroicons/react/outline' */

declare let window: any; // TODO: specifically extend type to valid injected objects.

const payTokens = [
  {
    id: 1,
    title: 'Pay with BOBA',
    description: 'Pay the upload using BOBA tokens',
  },
  {
    id: 2,
    title: 'Pay with BOBA/ETH',
    description: 'Pay the upload using BOBA/ETH tokens',
  } /*
  {
    id: 3,
    title: 'Retweet to unlock',
    description: 'Require a retweet of specific tweet in order to unlock the content',
    users: '2740 users',
  }, */,
];

const Index = () => {
  // const router = useRouter();
  const { bundler, bundlerBoba } = useContext<any>(BundlrContext);
  const { account } = useEthers();
  const [DB, setDb] = useState<any>();
  // const [bobaBalance, setBalance] = useState<BigNumber>();
  const [img, setImg] = useState<ArrayBuffer>();
  const [imgFile, setImgFile] = useState<File>();
  const [imgSrc, setImgSrc] = useState<string>();
  const [price, setPrice] = useState<BigNumber>();
  const [priceBoba, setPriceBoba] = useState<BigNumber>();
  const [bundlerHttpAddress, setBundlerHttpAddress] = useState<string>(
    'https://devnet.bundlr.network'
  );
  const [accountAddress, setAccountAddress] = useState<string>();
  const [bundlerAddress, setBundlerAddress] = useState<string>();
  const [currency, setCurrency] = useState<string>();
  const [library, setLibrary] = useState<any>();

  // const [fundAmount, setFundingAmount] = useState<string>();
  // const [withdrawAmount, setWithdrawAmount] = useState<string>();
  const [selectedToken, setSelectedToken] = useState<any>(payTokens[1]);
  const router = useRouter();
  // parse decimal input into atomic units
  /* const parseInput = (input: string | number) => {
    const conv = new BigNumber(input).multipliedBy(bundler!.currencyConfig.base[1]);
    if (conv.isLessThan(0.001)) {
      console.log({ status: "error", title: `Value too small!` })
      return;
    }
    return conv;
  } */

  const handleUpload = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { files }: any = evt.target;
    const reader = new FileReader();
    if (files && files.length > 0) {
      reader.onload = async function () {
        if (reader.result) {
          setImg(reader.result as ArrayBuffer);
          setImgSrc(URL.createObjectURL(files[0]));
          setImgFile(files[0]);
          const imgsize = Buffer.from(reader.result as ArrayBuffer).byteLength;
          const priceUpload = await bundler?.getPrice(imgsize);
          const priceUploadBoba = await bundlerBoba?.getPrice(imgsize);

          setPrice(priceUpload.toString());
          setPriceBoba(priceUploadBoba.toString());
        }
      };
      reader.readAsArrayBuffer(files[0]);
    }
  };

  const handleFileClick = () => {
    const fileInputEl = document.createElement('input');
    fileInputEl.type = 'file';
    fileInputEl.accept = 'image/*, video/*, audio/*';
    fileInputEl.style.display = 'none';
    document.body.appendChild(fileInputEl);
    fileInputEl.addEventListener('input', function (e) {
      handleUpload(e as any);
      document.body.removeChild(fileInputEl);
    });
    fileInputEl.click();
  };

  /* const handlePrice = async () => {
    if (img) {
      const imgsize = Buffer.from(img).byteLength;
      const price = await bundler?.getPrice(imgsize);
      setPrice(price.toString());
    }
  }; */

  const lazyFunding = async (imgUploaded: any) => {
    if (bundler === null) {
      throw new Error('Bundlr not connected');
    }
    const balance = await bundler?.getLoadedBalance();
    const imgUploadedsize = Buffer.from(imgUploaded).byteLength;
    const priceUpload = await bundler?.getPrice(imgUploadedsize);

    if (balance.isLessThan(priceUpload)) {
      Alert(
        'warning',
        'Lazy funding account...',
        'Lazy funding account before the upload...'
      );
      const amount = priceUpload.minus(balance).multipliedBy(1.3);
      await bundler.fund(amount.minus(amount.modulo(1)));
    }
  };

  const lazyFundingBoba = async (imgUploaded: any) => {
    if (bundlerBoba === null) {
      throw new Error('Bundlr not connected');
    }
    const balance = await bundlerBoba?.getLoadedBalance();
    const imgUploadedsize = Buffer.from(imgUploaded).byteLength;
    const priceUpload = await bundlerBoba?.getPrice(imgUploadedsize);

    if (balance.isLessThan(priceUpload)) {
      Alert(
        'warning',
        'Lazy funding account...',
        'Lazy funding account before the upload...'
      );
      const amount = priceUpload.minus(balance).multipliedBy(1.3);
      await bundlerBoba.fund(amount.minus(amount.modulo(1)));
    }
  };

  const uploadFile = async (database: any) => {
    if (img && imgFile && accountAddress) {
      if (selectedToken.id === 1) {
        await lazyFundingBoba(img);
        console.log('uploading file', img);
        Alert('info', 'Uploading file...', 'Uploading file, please wait...');
        const res = await bundlerBoba?.uploader?.upload(img, [
          { name: 'Content-Type', value: imgFile.type },
        ]);

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
          res?.status === 200 || res?.status === 201 ? 'success' : 'error',
          res?.status === 200 || res?.status === 201
            ? 'Successful!'
            : `Unsuccessful! ${res?.status}`,
          res?.status === 200 || res?.status === 201
            ? `File upload to: https://arweave.net/${res.data.id}`
            : 'Error to upload the file!'
        );

        // insert file entry
        const file2Upload = {
          name: imgFile.name,
          size: imgFile.size,
          modifiedDate: imgFile?.lastModified
            ? imgFile.lastModified
            : new Date(),
          mimeType: imgFile.type,
          link: res?.data.id ? `https://arweave.net/${res.data.id}` : undefined,
          cid: res?.data.id ? res.data.id : undefined,
          minted: false,
        };

        insertFileEntry(database, file2Upload, accountAddress);
        router.push('/');
      } else {
        await lazyFunding(img);
        console.log('uploading file', img);
        Alert('info', 'Uploading file...', 'Uploading file, please wait...');
        const res = await bundler?.uploader?.upload(img, [
          { name: 'Content-Type', value: imgFile.type },
        ]);

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
          res?.status === 200 || res?.status === 201 ? 'success' : 'error',
          res?.status === 200 || res?.status === 201
            ? 'Successful!'
            : `Unsuccessful! ${res?.status}`,
          res?.status === 200 || res?.status === 201
            ? `File upload to: https://arweave.net/${res.data.id}`
            : 'Error to upload the file!'
        );

        // insert file entry
        const file2Upload = {
          name: imgFile.name,
          size: imgFile.size,
          modifiedDate: imgFile?.lastModified
            ? imgFile.lastModified
            : new Date(),
          mimeType: imgFile.type,
          link: res?.data.id ? `https://arweave.net/${res.data.id}` : undefined,
          cid: res?.data.id ? res.data.id : undefined,
          minted: false,
        };

        insertFileEntry(database, file2Upload, accountAddress);
        router.push('/');
      }
    }
  };

  /* const fundBobaEther = async () => {
    if (bundler && fundAmount) {
      const res = bundler.fundBobaEther(
        EthersBignumber.from(ethers.utils.parseEther(fundAmount))
      );
      console.log(res);
    }
  }; */

  // const sleep = (ms) => new Promise(((resolve, reject) => setTimeout(resolve, ms)));

  /* const fundBobaEther = async () => {
    if (bundler && fundAmount) {
      console.log({ status: "info", title: "Checking...", amount: fundAmount.toString(), duration: 15000 })
      const value = parseInput(fundAmount)
      if (!value) return

      // Continuously perform balance checks
      while (true) {
        // Check your balance
        const balance = await bundler.getLoadedBalance();
        console.log('Balance: ', balance.toString(), value.toString(), parseInput(0.001).toString());
        // If balance is < 1 AR
        if (balance.isLessThan( parseInput(1) )) {  
          console.log({ status: "info", title: "Funding...", amount: fundAmount.toString(), duration: 15000 })
          await bundler.fund(value)
            .then(res => { console.log({ status: "success", title: `Funded ${res?.target}`, description: ` tx ID : ${res?.id}`, duration: 10000 }) })
            .catch(e => {
              console.log({ status: "error", title: `Failed to fund - ${e.data?.message || e.message}` })
            })
            return false;
        }
        // Wait for an hour before checking again (Arweave specific)
        // await sleep(15000);
      }

    }

  };


  const withdrawBobaEther = async () => {
    if (bundler && withdrawAmount) {
      await bundler
        .withdraw(EthersBignumber.from(ethers.utils.parseEther(withdrawAmount)))
        .then((data) => {
          console.log(data);
          console.log({
            status: "success",
            title: "Withdrawal successful",
            duration: 5000,
          });
        })
        .catch((err: any) => {
          console.log({
            status: "error",
            title: "Withdrawal Unsuccessful!",
            description: err.response?.data,
            duration: 5000,
          });
        });
    }
  }; */

  /* const updateAddress = (evt: React.BaseSyntheticEvent) => {
    setBundlerHttpAddress(evt.target.value);
  };

  const updateFundAmount = (evt: React.BaseSyntheticEvent) => {
    setFundingAmount(evt.target.value);
  };

  const updateWithdrawAmount = (evt: React.BaseSyntheticEvent) => {
    setWithdrawAmount(evt.target.value);
  }; */

  const resetUpload = () => {
    setImg(undefined);
    setImgSrc(undefined);
    setImgFile(undefined);
  };

  const currentFile: any = {
    name: imgFile?.name,
    size: imgFile?.size,
    source:
      'https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
    information: {
      'BOBA Cost': priceBoba
        ? ethers.utils.formatEther(priceBoba.toString())
        : '0',
      'BOBA/ETH Cost': price ? ethers.utils.formatEther(price.toString()) : '0',
      /* Created: 'June 8, 2020',
      'Last modified': 'June 8, 2020',
      Dimensions: '4032 x 3024',
      Resolution: '72 x 72', */
    },
    sharedWith: [
      {
        id: 1,
        name: account || '0x',
      },
    ],
  };

  useEffect(() => {
    // setBlockNumber(blocknumber);
    const libraryWeb3 = new ethers.providers.Web3Provider(
      window.ethereum,
      'any'
    );
    setLibrary(libraryWeb3);
    setCurrency('boba-eth');
    const db = getDatabase(window.localStorage);
    setDb(db);
    // connectBundlr();
    if (selectedToken.id === 1) {
      setBundlerAddress(bundlerBoba?.address);
    } else {
      setBundlerAddress(bundler?.address);
    }

    setBundlerHttpAddress('https://devnet.bundlr.network');
    if (account && account !== 'undefined') {
      setAccountAddress(account);
    }
  }, []);
  console.log('bundlerAddress ', currency, library, bundlerAddress, imgFile);

  return (
    <Dashboard
      auth={true}
      meta={
        <Meta
          title="BOBA Nftify"
          description="Allows users on Boba to easily deploy and engage with Arweave via Bundlr, using BOBA tokens"
        />
      }
    >
      <div className="md:grid md:grid-cols-8 md:gap-6">
        <div className="md:col-span-5">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Upload a file
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>
            {!imgSrc && (
              <div className="mt-6 md:py-3 md:px-4">
                <div className="flex justify-center py-10 px-6 mt-1 rounded-md border-2 border-gray-300 border-dashed">
                  <button
                    id="uploaditem"
                    className="justify-center"
                    onClick={handleFileClick}
                  >
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto w-12 h-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative font-medium text-indigo-600 hover:text-indigo-500 bg-white rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 cursor-pointer"
                        >
                          <span>Select a file</span>
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF, MP4, MP3, OGG
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {imgSrc && imgFile && (
            <div className="py-3 px-4 mt-6">
              {[
                'video/mp4',
                'video/ogg',
                'video/x-msvideo',
                'video/quicktime',
              ].includes(imgFile.type) && (
                <div className="block overflow-hidden w-full rounded-lg aspect-w-10 aspect-h-7">
                  <video
                    controls
                    className="object-cover object-center w-full"
                    loop
                  >
                    <source
                      type={imgFile.type}
                      src={imgSrc || '/assets/images/placeholder.png'}
                    />
                    Sorry, your browser doesnt support embedded videos.
                  </video>
                </div>
              )}
              {['audio/mpeg', 'audio/ogg', 'audio/wav'].includes(
                imgFile.type
              ) && (
                <div className="block overflow-hidden rounded-lg">
                  <audio
                    controls
                    className="object-cover object-center w-full"
                    loop
                  >
                    <source
                      type={imgFile.type}
                      src={imgSrc || '/assets/images/placeholder.png'}
                    />
                    Sorry, your browser doesnt support embedded audios.
                  </audio>
                </div>
              )}
              {['image/png', 'image/jpeg', 'image/gif'].includes(
                imgFile.type
              ) && (
                <div className="block overflow-hidden w-full rounded-lg aspect-w-10 aspect-h-7">
                  <img
                    className="object-cover object-center w-full"
                    src={imgSrc || '/assets/images/placeholder.png'}
                    alt={imgFile.name}
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
                    {prettyBytes(currentFile.size || 0)}
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
        <div className="py-3 px-4 mt-5 md:col-span-2 md:mt-0">
          <aside className="overflow-y-auto p-8 w-96 bg-white rounded-lg border border-gray-200 lg:block">
            <div className="pb-16 space-y-6">
              {imgSrc && imgFile && (
                <div>
                  <div className="block overflow-hidden w-full rounded-lg">
                    <img src={imgSrc} alt="" />
                  </div>
                  <div className="flex justify-between items-start mt-4">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        <span className="sr-only">Details for </span>
                        {imgFile.name}
                      </h2>
                      <p className="text-sm font-medium text-gray-500">
                        {prettyBytes(imgFile.size)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {imgSrc && imgFile && (
                <div>
                  <h3 className="font-medium text-gray-900">Information</h3>
                  <dl className="mt-2 border-y border-gray-200 divide-y divide-gray-200">
                    {Object.keys(currentFile.information).map((key) => (
                      <div
                        key={key}
                        className="flex justify-between py-3 text-sm font-medium"
                      >
                        <dt className="text-gray-500">{key}</dt>
                        <dd className="text-gray-900">
                          {currentFile.information[key]}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-900">Connected Network</h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="py-0.5 px-2.5 mr-2 text-xs font-semibold text-yellow-800 dark:text-yellow-900 bg-yellow-100 dark:bg-yellow-200 rounded">
                    {bundlerHttpAddress || 'Not Connected'}
                  </span>
                  <button
                    type="button"
                    className="flex justify-center items-center w-8 h-8 text-gray-400 hover:text-gray-500 bg-white hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <LightningBoltIcon
                      className="w-5 h-5 text-green-400"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Change</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap">
                <div className="inline-block px-4">
                  <RadioGroup value={selectedToken} onChange={setSelectedToken}>
                    <RadioGroup.Label className="text-base font-medium text-gray-900">
                      Select a token to pay your upload
                    </RadioGroup.Label>

                    <div className="grid grid-cols-1 gap-y-6 mt-4 sm:grid-cols-2 sm:gap-x-4">
                      {payTokens.map((lockingType) => (
                        <RadioGroup.Option
                          key={lockingType.id}
                          value={lockingType}
                          className={({ checked, active }): any =>
                            classNames(
                              checked
                                ? 'border-transparent'
                                : 'border-gray-300',
                              active ? 'ring-2 ring-green-500' : '',
                              'relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none'
                            )
                          }
                        >
                          {({ checked, active }) => (
                            <>
                              <div className="flex flex-1">
                                <div className="flex flex-col">
                                  <RadioGroup.Label
                                    as="span"
                                    className="block text-xs font-medium text-gray-900"
                                  >
                                    {lockingType.title}
                                  </RadioGroup.Label>
                                  <RadioGroup.Description
                                    as="span"
                                    className="flex items-center mt-1 text-xs text-gray-500"
                                  >
                                    {lockingType.description}
                                  </RadioGroup.Description>
                                </div>
                              </div>
                              <CheckCircleIcon
                                className={classNames(
                                  !checked ? 'invisible' : '',
                                  'h-5 w-5 text-green-600'
                                )}
                                aria-hidden="true"
                              />
                              <div
                                className={classNames(
                                  active ? 'border' : 'border-2',
                                  checked
                                    ? 'border-green-500'
                                    : 'border-transparent',
                                  'absolute -inset-px rounded-lg pointer-events-none'
                                )}
                                aria-hidden="true"
                              />
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Account</h3>
                <ul
                  role="list"
                  className="mt-2 border-y border-gray-200 divide-y divide-gray-200"
                >
                  {currentFile.sharedWith.map((person: any) => (
                    <li
                      key={person.id}
                      className="flex justify-between items-center py-3"
                    >
                      <div className="flex items-center">
                        <span className="w-8 h-8 rounded-full">
                          <Identicon accountId={person.name} iconSize={32} />
                        </span>
                        <p className="ml-2 text-xs font-medium text-gray-900">
                          {person.name}
                        </p>
                      </div>
                    </li>
                  ))}
                  <li className="flex justify-between items-center py-2">
                    <Link href="/profile" passHref>
                      <button
                        type="button"
                        className="group flex items-center p-1 -ml-1 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <span className="flex justify-center items-center w-8 h-8 text-gray-400 rounded-full border-2 border-gray-300 border-dashed">
                          <CurrencyDollarIconSolid
                            className="w-5 h-5 text-green-500"
                            aria-hidden="true"
                          />
                        </span>
                        <span className="ml-4 text-sm font-medium text-green-600 group-hover:text-green-500">
                          Fund Account
                        </span>
                      </button>
                    </Link>
                  </li>
                </ul>
              </div>
              {imgSrc && imgFile && (
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => uploadFile(DB)}
                    className="flex-1 py-2 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => resetUpload()}
                    className="flex-1 py-2 px-4 ml-3 text-sm font-medium text-red-700 hover:text-white bg-white hover:bg-red-500 rounded-md border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </Dashboard>
  );
};

export default Index;
