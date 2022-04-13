import { CurrencyDollarIcon as CurrencyDollarIconSolid } from '@heroicons/react/solid';

import { Dashboard } from '@/layouts/Dashboard';
import { Meta } from '@/layouts/Meta';

const Profile = () => (
  <Dashboard
    auth={true}
    meta={
      <Meta
        title="BOBA Nftify - Profile"
        description="Allows users on Boba to easily deploy and engage with Arweave via Bundlr, using BOBA tokens"
      />
    }
  >
    <div>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Profile
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Account and balances information
            </p>
          </div>
        </div>
        <div className="p-3 mt-5 md:col-span-2 md:mt-0">
          <div className="shadow sm:overflow-hidden sm:rounded-md">
            <div className="py-5 px-4 space-y-2 bg-white sm:p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 sm:col-span-2">
                  <label
                    htmlFor="company-website"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Account Address
                  </label>
                  <div className="flex mt-1">
                    <span className="py-0.5 px-2.5 mr-2 text-xs font-semibold text-yellow-800 dark:text-yellow-900 bg-yellow-100 dark:bg-yellow-200 rounded">
                      0xbF4f54eb703cAf3C1e88C012806Dfc81F034Cd77
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 shadow sm:overflow-hidden sm:rounded-md">
            <div className="py-5 px-4 space-y-2 bg-white sm:p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 sm:col-span-2">
                  <label
                    htmlFor="company-website"
                    className="block text-sm font-medium text-gray-500"
                  >
                    Fund your Bundlr Account (BOBA Token)
                  </label>
                  <div className="flex mt-1 rounded-md shadow-sm">
                    <input
                      type="number"
                      step="0.001"
                      name="amount-boba"
                      id="amount-boba"
                      className="block flex-1 w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="0.003"
                    />
                    <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 rounded-r-md border border-l-0 border-gray-300">
                      BOBA
                    </span>
                  </div>
                  <button
                    type="button"
                    className="group flex items-center p-1 -ml-1 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 shadow sm:overflow-hidden sm:rounded-md">
            <div className="py-5 px-4 space-y-2 bg-white sm:p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 sm:col-span-2">
                  <label
                    htmlFor="company-website"
                    className="block text-sm font-medium text-gray-500"
                  >
                    Fund your Bundlr Account (BOBA/ETH Token)
                  </label>
                  <div className="flex mt-1 rounded-md shadow-sm">
                    <input
                      type="number"
                      step="0.001"
                      name="amount-boba-eth"
                      id="amount-boba-eth"
                      className="block flex-1 w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="0.003"
                    />
                    <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 rounded-r-md border border-l-0 border-gray-300">
                      ETH
                    </span>
                  </div>
                  <button
                    type="button"
                    className="group flex items-center p-1 -ml-1 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dashboard>
);

export default Profile;
