import { gql } from '@apollo/client';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { differenceInDays, format, parseISO, sub } from 'date-fns';
import { Button, Table } from 'flowbite-react';
import {
  chain,
  constant,
  find,
  findLast,
  groupBy,
  map,
  maxBy,
  meanBy,
  minBy,
  shuffle,
  slice,
  times
} from 'lodash';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { NexusGenFieldTypes } from 'nexus-typegen';
import React, { useMemo, useState } from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';

import Auction from 'components/Bikes/Auction';
import Spec from 'components/Bikes/Spec';

import AuctionsChart from 'components/Charts/AuctionsChart';
// import PriceChart from 'components/Charts/LineChart';
import PriceChart from 'components/Charts/PriceChart';

import { addApolloState, initializeApollo } from 'lib/apollo';

import tailwindConfig from 'tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);

const twcolors = (fullConfig.theme?.colors as Record<string, string>) ?? {};

const colors = [
  { value: twcolors['blue']['900'], name: 'blue-900' },
  { value: twcolors['red']['600'], name: 'red-600' },
  { value: twcolors['orange']['500'], name: 'orange-500' },
  { value: twcolors['amber']['500'], name: 'amber-500' },
  { value: twcolors['indigo']['500'], name: 'indigo-500' },
  { value: twcolors['yellow']['300'], name: 'yellow-300' },
  { value: twcolors['lime']['200'], name: 'lime-200' },
  { value: twcolors['green']['500'], name: 'green-500' },
  { value: twcolors['emerald']['500'], name: 'emerald-500' },
  { value: twcolors['teal']['500'], name: 'teal-500' },
  { value: twcolors['violet']['500'], name: 'violet-500' },
  { value: twcolors['purple']['500'], name: 'purple-500' },
  { value: twcolors['fuchsia']['500'], name: 'fuchsia-500' },
  { value: twcolors['rose']['500'], name: 'rose-500' }
];

const BIKE_DETAILS_QUERY = gql`
  query bikeDetailsQuery($id: String!) {
    auctions(bikeId: $id) {
      id
      link
      price
      imageUrl
      createdOn
      domain
    }
    bikeDetails(id: $id) {
      id
      imageUrl
      make
      model
      year
      type
      displacement
      engine
      power
      torque
      top_speed
      cooling
      gearbox
      transmission
      fuel_consumption
      front_brakes
      rear_brakes
      dry_weight
      total_weight
      seat_height
      fuel_capacity
      auctions {
        id
        link
        price
        imageUrl
        createdOn
        domain
      }
    }
  }
`;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true
    };
  }

  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({
    query: BIKE_DETAILS_QUERY,
    variables: { id: params?.id }
  });

  if (!data.bikeDetails) {
    return {
      notFound: true
    };
  }

  return addApolloState(apolloClient, {
    props: { bikeDetails: data.bikeDetails, auctions: data.auctions }
  });
};

type BikeDetailsProps = {
  auctions: NexusGenFieldTypes['Auction'][];
  bikeDetails: NexusGenFieldTypes['Bike'];
};

const formatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'EUR'
});

const pageSize = 5;

const BikeDetails: React.FC<BikeDetailsProps> = ({ auctions, bikeDetails }) => {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(auctions.length / pageSize);
  const now = new Date();
  const meanPrice = meanBy(auctions, 'price');
  const maxPriceAuction = maxBy(auctions, 'price');
  const minPriceAuction = minBy(auctions, 'price');
  const lastPrice = auctions[0]?.price;

  const auctionData = chain(auctions)
    .groupBy('domain')
    .map((auctionGroup, key) => {
      return {
        domain: key,
        points: map(auctionGroup, (auction) => ({
          label: `${auction.domain} / ${format(parseISO(auction.createdOn), 'yyyy-MM-dd')}`,
          x: differenceInDays(parseISO(auction.createdOn), now) as number,
          y: auction.price as number
        }))
      };
    })
    .orderBy(['auctionCount'], ['desc'])
    .map((auctionGroup, index) => {
      return {
        ...auctionGroup,
        color: colors[index]
      };
    })
    .value();

  const groupedData = chain(auctions)
    .groupBy((auction) => format(parseISO(auction.createdOn), 'yyyy-MM'))
    .value();

  const chartData = chain(12)
    .times((index) => format(sub(now, { months: index }), 'yyyy-MM'))
    .reverse()
    .map((dataPoint, index) => {
      const entries = groupedData[dataPoint];

      return {
        label: dataPoint,
        y: meanBy(entries, 'price'),
        x: index
      };
    })
    .map((dataPoint, index, array) => {
      if (dataPoint.y) {
        return dataPoint;
      }
      const fallback = findLast(array, (item) => Boolean(item.y), index);
      return {
        ...dataPoint,
        y: fallback?.y ?? 0
      };
    })
    .value();

  const totalAvgData = times(chartData.length, (index) => ({
    x: index,
    y: meanPrice
  }));

  const pointsData = chain(auctions)
    .map((auction) => {
      return {
        label: `${auction.domain}@${format(parseISO(auction.createdOn), 'yyyy-MM-dd')}`,
        x: differenceInDays(parseISO(auction.createdOn), now) as number,
        y: auction.price as number
      };
    })
    .value();

  const handleAuctionsPage = (evt: React.MouseEvent<HTMLSpanElement>) => {
    const target = evt.target as HTMLSpanElement;
    const page = parseInt(target?.parentElement?.dataset['page'] as string);
    if (!page && page !== 0) {
      return;
    }

    setPage(page);
  };

  const pagedAuctions = slice(auctions, page * pageSize, (page + 1) * pageSize);

  return (
    <article className='flex items-center flex-col gap-8'>
      <h1 className='text-2xl font-semibold text-blue-900 mt-4 mb-12'>
        {`Latest Deals for ${bikeDetails.make} ${bikeDetails.model} ${bikeDetails.year}`}
      </h1>
      <section className='flex gap-6 flex-wrap justify-center max-w-6xl'>
        {bikeDetails?.auctions?.slice(0, 6).map((auction) => {
          if (!auction) {
            return null;
          }

          return <Auction auction={auction} key={auction.id} model={bikeDetails.model} />;
        })}
      </section>
      <h2 className='text-xl font-semibold text-blue-900 mt-12 mb-8'>Price analysis</h2>
      <section className='max-w-6xl flex flex-wrap gap-4'>
        {auctionData.map((auctionGroup) => {
          return (
            <div className='cursor-pointer' key={auctionGroup.domain}>
              <span className='leading-none p-1'>{auctionGroup.domain}</span>
              <div
                className={clsx(
                  `bg-${auctionGroup.color.name}`,
                  'h-2 rounded-md shadow-sm-light'
                )}></div>
            </div>
          );
        })}
      </section>
      <section className='grid max-w-6xl lg:w-[72rem] grid-cols-12 bg-white shadow-md rounded-md pt-4'>
        <PriceChart
          auctionsData={auctionData}
          avgPriceData={chartData}
          className='col-span-12'
          pointsData={pointsData}
          totalAvgData={totalAvgData}
        />
        <div className='col-span-4 text-sm p-4 pt-2'>
          <Link className='flex gap-2 items-center' href={minPriceAuction?.link as string}>
            Min Price:
            <span className='font-bold'>
              {formatter.format(minPriceAuction?.price as number)} /{' '}
              {format(parseISO(minPriceAuction?.createdOn), 'yyyy-MM-dd')}
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
              {format(parseISO(maxPriceAuction?.createdOn), 'yyyy-MM-dd')}
            </span>
            <ArrowTopRightOnSquareIcon className='w-4 h-4' />
          </Link>
        </div>
      </section>
      <section className='grid max-w-6xl lg:w-[72rem] grid-cols-12 gap-8'>
        <div className='col-span-8'>
          <Table>
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Diff From Avg</Table.HeadCell>
              <Table.HeadCell>Link</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y bg-red-500 rounded-none'>
              {pagedAuctions?.map((auction) => (
                <Table.Row
                  className='bg-white dark:border-gray-700 dark:bg-gray-800'
                  key={auction.id}>
                  <Table.Cell>{auction.createdOn}</Table.Cell>
                  <Table.Cell>{formatter.format(auction?.price as number)}</Table.Cell>
                  <Table.Cell>
                    {((100 * (auction?.price as number)) / meanPrice - 100).toFixed(2)}
                  </Table.Cell>
                  <Table.Cell>
                    <Link className='flex gap-2' href={auction.link as string}>
                      Go to:
                      <ArrowTopRightOnSquareIcon className='w-4 h-4' />
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <div className='col-span-4 row-span-2'>
          <AuctionsChart auctionsData={auctionData} />
        </div>
        <div className='col-span-8'>
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
      </section>
      <section></section>
      <h2 className='text-xl font-semibold text-blue-900 mt-12 mb-8'>Technical Specs</h2>
      <Spec bikeDetails={bikeDetails} />
    </article>
  );
};

export default BikeDetails;
