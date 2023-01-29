import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid';
import { format, parseISO } from 'date-fns';

import { maxBy, meanBy, minBy } from 'lodash';
import Link from 'next/link';

import React from 'react';

import { formatISOtoUTC } from '@/lib/utils';
import { NexusGenFieldTypes } from 'graphql/nexus-typegen';

type MainChartSummaryProps = {
  auctions: NexusGenFieldTypes['Auction'][];
};

const formatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'EUR'
});

const MainChartSummary: React.FC<MainChartSummaryProps> = ({ auctions }) => {
  const meanPrice = meanBy(auctions, 'price');
  const maxPriceAuction = maxBy(auctions, 'price');
  const minPriceAuction = minBy(auctions, 'price');

  return (
    <>
      <div className='col-span-4 text-sm p-4 pt-2'>
        <Link className='flex gap-2 items-center' href={minPriceAuction?.link as string}>
          Min Price:
          <span className='font-bold'>
            {formatter.format(minPriceAuction?.price as number)} /{' '}
            {formatISOtoUTC(minPriceAuction?.createdOn)}
          </span>
          <ArrowTopRightOnSquareIcon className='w-4 h-4' />
        </Link>
      </div>
      <div className='col-span-4 text-sm p-4 pt-2 justify-self-center items-center'>
        Average Price: <span className='font-bold'>{formatter.format(meanPrice)}</span>
      </div>
      <div className='col-span-4 text-sm p-4 pt-2 text-red-800 justify-self-end'>
        <Link className='flex gap-2 items-center' href={maxPriceAuction?.link as string}>
          Max Price:
          <span className='font-bold'>
            {formatter.format(maxPriceAuction?.price as number)} /{' '}
            {formatISOtoUTC(maxPriceAuction?.createdOn)}
          </span>
          <ArrowTopRightOnSquareIcon className='w-4 h-4' />
        </Link>
      </div>
    </>
  );
};

export default MainChartSummary;
