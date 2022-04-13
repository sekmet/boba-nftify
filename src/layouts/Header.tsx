import BigNumber from 'bignumber.js';
import { useState, useEffect, useContext } from 'react';
import { BundlrContext } from '@/context/BundlrContext';
import { ethers } from 'ethers';

export default function Header(props:any) {
const { bundler, bundlerBoba } = useContext<any>(BundlrContext);
const { account } = props;
const [balance, setBalance] = useState<string>('0')
const [balanceEth, setBalanceEth] = useState<string>('0')

useEffect(() => {
  account && bundler?.getBalance(account).then((res: BigNumber) => setBalanceEth(res.toString()));
  account && bundlerBoba?.getBalance(account).then((res: BigNumber) => setBalance(res.toString()));
}, [])

return (
    <header className="bg-white shadow">
        <div className="py-3 px-4 mx-auto max-w-7xl">
        

        <div className="md:grid md:grid-cols-8 md:gap-2">
        <div className="md:col-span-3">
        <h1 className="text-3xl font-bold text-gray-900">Files</h1>
          </div>
        <div className="md:col-span-2">
        <div className="mx-auto max-w-7xl flex items-center space-x-4">
        <img className="w-10 h-10 rounded-full" src="/assets/images/boba_token_icon.png" alt="boba network" />
        <div className="font-medium dark:text-white">
        <div>{ethers.utils.formatEther(balance)}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">BOBA Balance</div>
        </div>
        </div>
        </div>

        <div className="md:col-span-3">
        <div className="mx-auto max-w-7xl flex items-center space-x-4">
        <img className="w-10 h-10 rounded-full" src="/assets/images/ether_logo_icon.png" alt="boba network" />
        <div className="font-medium dark:text-white">
        <div>{ethers.utils.formatEther(balanceEth)}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">BOBA/ETH Balance</div>
        </div>
        </div>
        </div>
        </div>

        </div>
    </header>
  );
}
