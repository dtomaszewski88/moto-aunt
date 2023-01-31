import { ArrowTopRightOnSquareIcon, StarIcon as StarIconSolid } from '@heroicons/react/20/solid';
import { StarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

import React from 'react';

import { formatISOtoUTC } from '@/lib/utils';

import { NexusGenFieldTypes } from 'graphql/nexus-typegen';

type AuctionProps = {
  auction: NexusGenFieldTypes['Auction'];
  model?: NexusGenFieldTypes['Bike']['model'];
  onFavClick?: (arg: NexusGenFieldTypes['Auction']) => void;
};

const formatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'EUR'
});

const Auction: React.FC<AuctionProps> = ({ auction, model, onFavClick }) => {
  return (
    <div className='rounded-md relative overflow-hidden' key={auction.id}>
      <div className='absolute top-0 left-0 right-0 bg-neutral-900 bg-opacity-75 text-blue-100  grid grid-cols-2 p-2'>
        <span>{formatISOtoUTC(auction.createdOn)}</span>
        <Link className='flex items-center gap-2 justify-self-end' href={auction.link as string}>
          {auction.domain} <ArrowTopRightOnSquareIcon className='w-4 h-4' />
        </Link>
      </div>
      <Image
        alt={model ?? ''}
        className=''
        height={240}
        src={`/images/${auction.imageUrl}`}
        width={360}
      />
      <div className='absolute bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-75 text-blue-100 text-center font-bold p-2 text-md'>
        {formatter.format(auction.price as number)}
      </div>
      {Boolean(onFavClick) && (
        <div className='absolute bottom-0 right-0 p-2 flex items-center justify-center'>
          <button
            className='text-white hover:text-blue-400'
            type='button'
            onClick={() => onFavClick?.(auction)}>
            {auction.isFavourite ? (
              <StarIconSolid className='h-6 w-6' />
            ) : (
              <StarIcon className='h-6 w-6' />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Auction;
