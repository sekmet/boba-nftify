import { useEffect, useState, Fragment } from 'react';

import { useEthers, useBlockMeta, useBlockNumber } from '@usedappify/core';

import { Dashboard } from '@/layouts/Dashboard';
import { Meta } from '@/layouts/Meta';

const Index = () => {
  // const router = useRouter();
  const [blockNumber, setBlockNumber] = useState<number | undefined>(0);
  const { account } = useEthers();
  const { timestamp } = useBlockMeta();
  const blocknumber = useBlockNumber();

  useEffect(() => {
    setBlockNumber(blocknumber);
  }, [blocknumber]);

  return (
    <Dashboard
      auth={true}
      meta={
        <Meta
          title="Boba Nftify"
          description="Allows users on Boba to easily deploy and engage with Arweave via Bundlr, using BOBA tokens"
        />
      }
    >
      <div className="max-w-none prose prose-slate dark:prose-invert">
        <h1 className="text-2xl font-bold">Boba Nftify</h1>
        <p className="leading-text">
          <span role="img" aria-label="rocket">
            🚀
          </span>{' '}
          Allows users on Boba to easily deploy and engage with Arweave via
          Bundlr, using BOBA tokens
          <span role="img" aria-label="zap">
            ⚡️
          </span>{' '}
        </p>
        {account && blockNumber && (
          <Fragment>
            <h2 className="-mt-3 mb-1 text-xl font-bold">Block number</h2>
            <h3 className="font-bold">
              <span className="inline-flex relative items-center py-0.5 px-2.5 text-lg font-medium text-green-400 bg-green-100 rounded-md">
                <svg
                  className="mt-1 -ml-0.5 w-6 h-6 text-green-300"
                  fill="currentColor"
                  viewBox="0 0 10 10"
                >
                  <circle cx={4} cy={4} r={2} />
                </svg>
                <span className="inline-flex absolute top-2 left-2.5 w-4 h-4 bg-green-300 rounded-full opacity-75 animate-ping"></span>
                {`📦 ${blockNumber}`}
              </span>
              <br />
              <i className="text-xs">[ {`${timestamp}`} ]</i>
            </h3>
          </Fragment>
        )}
      </div>
    </Dashboard>
  );
};

export default Index;
