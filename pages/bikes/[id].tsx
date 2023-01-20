import { gql } from '@apollo/client';
import { differenceInDays, format, parseISO } from 'date-fns';
import { chain, groupBy, map, maxBy, meanBy } from 'lodash';
import { GetServerSideProps } from 'next';
import { NexusGenFieldTypes } from 'nexus-typegen';

import React from 'react';

import Auction from 'components/Bikes/Auction';
import Spec from 'components/Bikes/Spec';

import LineChart from 'components/Charts/LineChart';
import { addApolloState, initializeApollo } from 'lib/apollo';

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

const BikeDetails: React.FC<BikeDetailsProps> = ({ auctions, bikeDetails }) => {
  console.log('auctions', auctions);
  const now = new Date();
  const chartData = chain(auctions)
    .groupBy((auction) => format(parseISO(auction.createdOn), 'yyyy-MM'))
    .map((value, key) => ({
      value: meanBy(value, 'price'),
      label: key
    }))
    .value();
  const maxPrice = maxBy(auctions, 'price');
  const minPrice = 0;
  const pointsData = chain(auctions)
    .map((auction) => {
      return {
        x: (differenceInDays(now, parseISO(auction.createdOn)) / 365) as number,
        y: auction.price as number
      };
    })
    .value();

  console.log('auctions chartData', chartData);
  console.log('auctions pointData', pointsData);
  return (
    <article className='flex items-center flex-col'>
      <h2>Price analysis</h2>
      <LineChart avgPriceData={chartData} pointsData={pointsData} />
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
      <h2 className='text-xl font-semibold text-blue-900 mt-12 mb-8'>Technical Specs</h2>
      <Spec bikeDetails={bikeDetails} />
    </article>
  );
};

export default BikeDetails;
