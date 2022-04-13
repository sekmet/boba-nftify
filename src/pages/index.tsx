import { useEffect, useState } from 'react';

import {
  PlusSmIcon as PlusSmIconSolid,
  // SearchIcon,
  ViewGridIcon as ViewGridIconSolid,
  ViewListIcon,
} from '@heroicons/react/solid';
import { useEthers } from '@usedappify/core';
import Link from 'next/link';
import prettyBytes from 'pretty-bytes';

import { Listing } from '@/components/Files/Listing';
import Identicon from '@/components/Wallet/Identicon';
import { Dashboard } from '@/layouts/Dashboard';
import { Meta } from '@/layouts/Meta';
import { classNames } from '@/utils';
// import { Dialog, Menu, Transition } from '@headlessui/react'
/* import {
  // CogIcon,
  // CollectionIcon,
  // HeartIcon,
  HomeIcon,
  // MenuAlt2Icon,
  PhotographIcon,
  // PlusSmIcon as PlusSmIconOutline,
  UserGroupIcon,
  ViewGridIcon as ViewGridIconOutline,
  // XIcon,
} from '@heroicons/react/outline' */
import { getDatabase, getFiles, getFilesByName } from '@/utils/db';

declare let window: any; // TODO: specifically extend type to valid injected objects.

const tabs = [
  { name: 'Uploaded Files', href: '#', current: true },
  { name: 'Minted', href: '#', current: false },
  // { name: 'Favorited', href: '#', current: false },
];

let currentFile = {
  ID: 0,
  name: 'BOBA-NETWORK.png',
  size: 39000,
  link: '/assets/images/boba_token_icon.png',
  information: {
    'Uploaded by': 'Boba user',
    Created: 'June 8, 2020',
    'Last modified': 'June 8, 2020',
    Dimensions: '4032 x 3024',
    Resolution: '72 x 72',
  },
  sharedWith: [
    {
      id: 1,
      name: 'Aimee Douglas',
      imageUrl:
        'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=1024&h=1024&q=80',
    },
  ],
};

const Index = () => {
  // const router = useRouter();
  const { account }: any = useEthers();
  const [DB, setDb] = useState<any>();
  const [currentfile, setCurrentFile] = useState<any>();
  const [userFiles, setUserFiles] = useState<any>();
  const [listview, setListview] = useState<string>('grid');

  /* const insertFile = (database: any) => {
     let file1 = { 
        name: '296300-mutation-var-3.png', 
        size: 4695902,
        modifiedDate: new Date(),
        mimeType: 'image/png',
        link: 'https://arweave.net/Mi0CyPel-0mqa3GD_h63mM_8on-Ag0aYcp3tbunngqA',
        cid: 'Mi0CyPel-0mqa3GD_h63mM_8on-Ag0aYcp3tbunngqA',
        minted: false
     }

     insertFileEntry(database, file1)
  } */

  const getFileDetails = (filename: string) => {
    const selectedFile = getFilesByName(DB, filename);
    setCurrentFile(selectedFile[0]);
  };

  useEffect(() => {
    const db = getDatabase(window.localStorage);
    setDb(db);
    const cfiles = getFiles(getDatabase(window.localStorage));
    setUserFiles(cfiles);
    if (cfiles.length) {
      const currentFilename = getFilesByName(db, cfiles[0].name);
      if (!currentfile) setCurrentFile(currentFilename[0]);
    }
  }, [listview]);

  console.log(currentfile);
  currentFile = currentfile || currentFile;
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
      {/* Main content */}
      <div className="flex overflow-hidden flex-1 items-stretch">
        <main className="overflow-y-auto flex-1">
          <div className="px-4 mx-auto max-w-7xl">
            <div className="flex">
              <div className="flex items-center p-0.5 ml-6 bg-gray-100 rounded-lg sm:hidden">
                <button
                  type="button"
                  onClick={() => setListview('list')}
                  className={classNames(
                    listview === 'list' ? 'bg-white shadow-sm' : '',
                    'p-1.5 rounded-md text-gray-400 hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
                  )}
                >
                  <ViewListIcon className="w-5 h-5" aria-hidden="true" />
                  <span className="sr-only">Use list view</span>
                </button>
                <button
                  type="button"
                  onClick={() => setListview('grid')}
                  className={classNames(
                    listview === 'grid' ? 'bg-white shadow-sm' : '',
                    'ml-0.5 p-1.5 rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
                  )}
                >
                  <ViewGridIconSolid className="w-5 h-5" aria-hidden="true" />
                  <span className="sr-only">Use grid view</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-3 sm:mt-2">
              <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                  Select a tab
                </label>
                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                <select
                  id="tabs"
                  name="tabs"
                  className="block py-2 pr-10 pl-3 w-full text-base rounded-md border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  defaultValue="Recently Viewed"
                >
                  <option>Uploaded Files</option>
                  <option>Minted</option>
                  <option>Favorited</option>
                </select>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center border-b border-gray-200">
                  <nav
                    className="flex flex-1 -mb-px space-x-6 xl:space-x-8"
                    aria-label="Tabs"
                  >
                    {tabs.map((tab) => (
                      <a
                        key={tab.name}
                        href={tab.href}
                        aria-current={tab.current ? 'page' : undefined}
                        className={classNames(
                          tab.current
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                          'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                        )}
                      >
                        {tab.name}
                      </a>
                    ))}
                  </nav>
                  <div className="hidden items-center p-0.5 ml-6 bg-gray-100 rounded-lg sm:flex">
                    <button
                      type="button"
                      onClick={() => setListview('list')}
                      className={classNames(
                        listview === 'list'
                          ? 'bg-white shadow-sm text-gray-600'
                          : 'text-gray-400',
                        'p-1.5 rounded-md  hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
                      )}
                    >
                      <ViewListIcon className="w-5 h-5" aria-hidden="true" />
                      <span className="sr-only">Use list view</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setListview('grid')}
                      className={classNames(
                        listview === 'grid'
                          ? 'bg-white shadow-sm text-gray-600'
                          : 'text-gray-400',
                        'ml-0.5 p-1.5 rounded-md  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
                      )}
                    >
                      <ViewGridIconSolid
                        className="w-5 h-5"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Use grid view</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Listing
              files={userFiles}
              view={listview}
              getFileDetails={(name: string) => getFileDetails(name)}
            />

            {/* <button
              type="button"
              className="flex-1 py-2 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
            >
              <CogIcon className="w-2 h-2" aria-hidden="true" /> Export Data
                      </button> */}
          </div>
        </main>

        {/* Details sidebar */}
        <aside className="hidden overflow-y-auto p-8 w-96 bg-white rounded-lg border border-gray-200 lg:block">
          <div className="pb-16 space-y-6">
            <div>
              <div className="block overflow-hidden w-full rounded-lg aspect-w-10 aspect-h-7">
                <img src={currentFile.link} alt="" className="object-cover" />
              </div>
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
                  className="flex justify-center items-center ml-4 w-8 h-8 text-gray-400 hover:text-gray-500 bg-white hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <HeartIcon className="w-6 h-6" aria-hidden="true" />
                  <span className="sr-only">Favorite</span>
                      </button> */}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Information</h3>
              <dl className="mt-2 border-y border-gray-200 divide-y divide-gray-200">
                {/* Object.keys(currentFile.information).map((key) => (
                      <div key={key} className="py-3 flex justify-between text-sm font-medium">
                        <dt className="text-gray-500">{key}</dt>
                        <dd className="text-gray-900">{currentFile.information[key]}</dd>
                      </div>
                    )) */}
              </dl>
            </div>
            {/* <div>
              <h3 className="font-medium text-gray-900">Description</h3>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm italic text-gray-500">
                  Add a description to this image.
                </p>
                <button
                  type="button"
                  className="flex justify-center items-center w-8 h-8 text-gray-400 hover:text-gray-500 bg-white hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <PencilIcon className="w-5 h-5" aria-hidden="true" />
                  <span className="sr-only">Add description</span>
                </button>
              </div>
                  </div> */}
            <div>
              <h3 className="font-medium text-gray-900">Account</h3>
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
                <li className="flex justify-between items-center py-2">
                  <button
                    type="button"
                    className="group flex items-center p-1 -ml-1 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <span className="flex justify-center items-center w-8 h-8 text-gray-400 rounded-full border-2 border-gray-300 border-dashed">
                      <PlusSmIconSolid className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <span className="ml-4 text-sm font-medium text-indigo-600 group-hover:text-indigo-500">
                      Fund Account
                    </span>
                  </button>
                </li>
              </ul>
            </div>
            <div className="flex">
              <Link href={`/mint/${currentFile.ID}`}>
                <a
                  id="mint"
                  className="flex-1 py-2 px-4 w-full text-sm font-medium text-center text-white bg-indigo-600 hover:bg-indigo-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
                >
                  Create NFT
                </a>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </Dashboard>
  );
};

export default Index;
