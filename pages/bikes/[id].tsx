import { gql } from '@apollo/client';

import { GetServerSideProps } from 'next';

import { NexusGenObjects } from 'nexus-typegen';

import React from 'react';

import Spec from 'components/Bikes/Spec';

import { addApolloState, initializeApollo } from 'lib/apollo';

const BIKE_DETAILS_QUERY = gql`
  query bikeDetailsQuery($id: String!) {
    bikeDetails(id: $id) {
      id
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

  return addApolloState(apolloClient, {
    props: { bikeDetails: data.bikeDetails }
  });
};

type BikeDetailsProps = {
  bikeDetails: NexusGenObjects['Bike'];
};

const BikeDetails: React.FC<BikeDetailsProps> = ({ bikeDetails }) => {
  //   console.log(bikeDetails);
  return (
    <article className='flex items-center flex-col'>
      <h1 className='text-2xl font-semibold text-blue-900 mt-4 mb-12'>
        {`${bikeDetails.make} ${bikeDetails.model} ${bikeDetails.year}`}
      </h1>
      {bikeDetails?.auctions?.map((auction) => {
        return <div key={auction.id}>{auction.link}</div>;
      })}
      <Spec bikeDetails={bikeDetails} />
    </article>
  );
};

export default BikeDetails;
