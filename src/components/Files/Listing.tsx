import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import prettyBytes from 'pretty-bytes';

import { classNames, ellipsisAddress } from '@/utils';

dayjs.extend(relativeTime);

export function Listing(props: any) {
  const [listview, setListview] = useState<string>('grid');
  const { files, view, getFileDetails } = props;
  // console.log({ files, view });
  useEffect(() => {
    setListview(view);
  }, [view]);

  return (
    <section className="pb-16 mt-8" aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="sr-only">
        Uploaded files
      </h2>
      {listview === 'grid' ? (
        <ul
          role="list"
          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
        >
          {files &&
            files.map((file: any) => (
              <li key={file.name} className="relative">
                <a onClick={() => getFileDetails(file.name)}>
                  <div
                    className={classNames(
                      file.current
                        ? 'ring-2 ring-offset-2 ring-indigo-500'
                        : 'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500',
                      'group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 overflow-hidden'
                    )}
                  >
                    {file.mimeType === 'video/mp4' ||
                    file.mimeType === 'video/ogg' ||
                    file.mimeType === 'video/x-msvideo' ||
                    file.mimeType === 'video/quicktime' ? (
                      <video
                        controls
                        className={classNames(
                          file.current ? '' : 'group-hover:opacity-75',
                          'object-cover pointer-events-none'
                        )}
                        loop
                      >
                        <source
                          type={file.mimeType}
                          src={
                            file.link
                              ? file.link
                              : '/assets/images/placeholder.png'
                          }
                        />
                        Sorry, your browser doesnt support embedded videos.
                      </video>
                    ) : (
                      <img
                        className={classNames(
                          file.current ? '' : 'group-hover:opacity-75',
                          'object-cover pointer-events-none'
                        )}
                        src={
                          file.link
                            ? file.link
                            : '/assets/images/placeholder.png'
                        }
                        alt={file.name}
                      />
                    )}

                    <button
                      type="button"
                      className="absolute inset-0 focus:outline-none"
                    >
                      <span className="sr-only">
                        View details for {file.name}
                      </span>
                    </button>
                  </div>
                </a>
                <p className="block mt-2 text-sm font-medium text-gray-900 truncate pointer-events-none">
                  {file.name}
                </p>
                <p className="block text-sm font-medium text-gray-500 pointer-events-none">
                  {prettyBytes(file.size)}
                </p>
              </li>
            ))}
        </ul>
      ) : (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Name
                </th>
                <th scope="col" className="py-3 px-6">
                  Link
                </th>
                <th scope="col" className="py-3 px-6">
                  Last Modified
                </th>
                <th scope="col" className="py-3 px-6">
                  Size
                </th>
                {/* <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Edit</span>
                    </th> */}
              </tr>
            </thead>
            <tbody>
              {files &&
                files.map((file: any) => (
                  <tr
                    key={file.name}
                    className="odd:bg-white even:bg-gray-50 dark:bg-gray-800 odd:dark:bg-gray-800 even:dark:bg-gray-700 border-b dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="py-4 px-6 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                    >
                      {file.name}
                    </th>
                    <td className="py-4 px-6">
                      <a href={file.link} target="_blank" rel="noreferrer">
                        #
                        {ellipsisAddress(
                          `${file.link}`.replace('https://arweave.net/', '')
                        )}
                      </a>
                    </td>
                    <td className="py-4 px-6">
                      {dayjs().to(file.modifiedDate)}
                    </td>
                    <td className="py-4 px-6">{prettyBytes(file.size)}</td>
                    {/* <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                </td> */}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
