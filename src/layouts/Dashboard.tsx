import { ReactNode, ReactElement, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { useEthers } from '@usedappify/core';
import { useSession } from 'next-auth/react';

import Header from '@/layouts/Header';
import Nav from '@/layouts/Nav';
// import WebBundlr
// import { WebBundlr } from "@bundlr-network/client";
import { BundlrContext } from '@/context/BundlrContext';

// import type { Session } from 'next-auth';
type IAuthProps = {
  children: ReactElement<any, any>;
};

declare var window: any // TODO: specifically extend type to valid injected objects.

const AuthApp = (props: IAuthProps) => {
  const { data, status }:any = useSession({ required: true });
  const isUser = !!data?.session?.user;

  if (isUser) {
    return props.children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  console.log(data, status);
  return <div>Loading...</div>;
};

type IDashboardProps = {
  meta: ReactNode;
  children: ReactNode;
  auth: boolean;
};


const Dashboard = (props: IDashboardProps) => {
  const { account } = useEthers();
  //const [bundler, setBundler] = useState<WebBundlr>();
  //const [bundlerBoba, setBundlerBoba] = useState<WebBundlr>();
  /*const [bundlerHttpAddress, setBundlerHttpAddress] = useState<string>(
    "https://devnet.bundlr.network"
  );*/
  // const [bundlerAddress, setBundlerAddress] = useState<string>();
  const [currency, setCurrency] = useState<string>();
  const [library, setLibrary] = useState<any>();
  const { bundler, setBundler, bundlerBoba, setBundlerBoba } = useContext<any>(BundlrContext);

useEffect(() => {
  const library = new ethers.providers.Web3Provider(window.ethereum, 'any');
  setLibrary(library)
  setCurrency('boba-eth')
}, [])

console.log({ bundler, setBundler, bundlerBoba, setBundlerBoba, currency, library })
return (
  <AuthApp>
    <>
    {props.meta}
    <div className="min-h-full">
      <Nav />
      <Header account={account} />
      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-6">
          {/* Replace with your content */}
          <div className="px-0">{props.children}</div>
          {/* /End replace */}
        </div>
      </main>
    </div>
    </>
  </AuthApp>
);

}

export { Dashboard };
