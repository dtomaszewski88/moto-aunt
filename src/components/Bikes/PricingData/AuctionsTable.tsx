import {
  ArrowTopRightOnSquareIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { format, parseISO } from 'date-fns';
import { Button, Table } from 'flowbite-react';
import { slice, times } from 'lodash';
import Link from 'next/link';

import React, { useMemo, useState } from 'react';

import { NexusGenFieldTypes } from 'graphql/nexus-typegen';

type AuctionsTableProps = {
  auctions: NexusGenFieldTypes['Auction'][];
  meanPrice: number;
  pageSize?: number;
};

const formatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'EUR'
});

const AuctionsTable: React.FC<AuctionsTableProps> = (props) => {
  const [page, setPage] = useState(0);
  const { auctions, meanPrice, pageSize = 5 } = props;

  const pageCount = Math.ceil(auctions.length / pageSize);

  const handleAuctionsPage = (evt: React.MouseEvent<HTMLSpanElement>) => {
    const target = evt.target as HTMLSpanElement;
    const page = parseInt(target?.parentElement?.dataset['page'] as string);
    if (!page && page !== 0) {
      return;
    }

    setPage(page);
  };

  const pagedAuctions = useMemo(
    () => slice(auctions, page * pageSize, (page + 1) * pageSize),
    [page, auctions, pageSize]
  );

  return (
    <>
      <div className='col-span-8'>
        <Table>
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>Diff From Avg</Table.HeadCell>
            <Table.HeadCell>Link</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y bg-red-500 rounded-none'>
            {pagedAuctions?.map((auction) => {
              const baseDiff = (auction?.price as number) / meanPrice;
              const diff = 100 * baseDiff - 100;
              const diffNegative = diff <= 0;

              return (
                <Table.Row
                  className='bg-white dark:border-gray-700 dark:bg-gray-800'
                  key={auction.id}>
                  <Table.Cell>{format(parseISO(auction.createdOn), 'dd/MM/yyyy')}</Table.Cell>
                  <Table.Cell>{formatter.format(auction?.price as number)}</Table.Cell>
                  <Table.Cell
                    className={clsx('font-bold flex items-center gap-2', {
                      'text-green-700': diffNegative,
                      'text-red-600': !diffNegative
                    })}>
                    {`${diff.toFixed(2)} %`}
                    {diffNegative && <ArrowTrendingDownIcon className='w-6 h-6' />}
                    {!diffNegative && <ArrowTrendingUpIcon className='w-6 h-6' />}
                  </Table.Cell>
                  <Table.Cell>
                    <Link className='flex gap-2' href={auction.link as string}>
                      Go to:
                      <ArrowTopRightOnSquareIcon className='w-4 h-4' />
                    </Link>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
      <div className='col-span-8 order-4'>
        <Button.Group onClick={handleAuctionsPage}>
          {times(pageCount, (index) => {
            return (
              <Button
                className={clsx({ 'bg-blue-300': page === index })}
                color='gray'
                data-page={index}
                key={index}>
                {index + 1}
              </Button>
            );
          })}
        </Button.Group>
      </div>
    </>
  );
};

export default AuctionsTable;
