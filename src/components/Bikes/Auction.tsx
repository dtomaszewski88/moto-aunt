import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

import React from 'react';

import { NexusGenFieldTypes, NexusGenObjects } from 'graphql/nexus-typegen';

type AuctionProps = {
  auction: NexusGenObjects['Auction'];
  model?: NexusGenFieldTypes['Bike']['model'];
};

const formatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'EUR'
});

const Auction: React.FC<AuctionProps> = ({ auction, model }) => {
  return (
    <div className='rounded-md relative overflow-hidden' key={auction.id}>
      <div className='absolute top-0 left-0 right-0 bg-neutral-900 bg-opacity-75 text-blue-100  grid grid-cols-2 p-2'>
        <span>{format(parseISO(auction.createdOn), 'dd/MM/yyyy')}</span>
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
    </div>
  );
};

export default Auction;
