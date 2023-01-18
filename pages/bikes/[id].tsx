import { gql } from '@apollo/client';

import { GetServerSideProps } from 'next';

import Image from 'next/image';

import { NexusGenObjects } from 'nexus-typegen';

import React from 'react';

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
  return (
    <article className='flex items-center flex-col'>
      <h1 className='text-2xl font-semibold text-blue-900 mt-4 mb-12'>
        {`${bikeDetails.make} ${bikeDetails.model} ${bikeDetails.year}`}
      </h1>
      <section className='grid grid-cols-12 bg-white shadow-md rounded-md max-w-6xl'>
        <Image
          alt={bikeDetails.model ?? ''}
          className='rounded-tr-md rounded-tl-md lg:rounded-tr-none lg:rounded-bl-md lg:col-span-6 col-span-12 width-full'
          height={400}
          src='/images/bike01.png'
          width={600}
        />
        <div className='grid lg:grid-cols-12 grid-cols-6 text-sm lg:text-xs lg:px-0 lg:col-span-6 col-span-12 justify-items-stretch'>
          <h3 className='lg:col-span-12 col-span-6 p-4 text-md lg:text-sm lg:p-1 font-bold flex items-center justify-center'>
            Specs
          </h3>
          <span className='p-4 lg:p-2 col-span-2 flex items-center bg-slate-200 lg:bg-slate-200 font-semibold lg:pl-4'>
            Type:
          </span>
          <span className='p-4 lg:p-2 col-span-4 flex items-center bg-slate-200 lg:bg-slate-200'>
            {bikeDetails.type}
          </span>
          <span className='p-4 lg:p-2 col-span-2 flex items-center lg:bg-slate-200 font-semibold'>
            Displacement:{' '}
          </span>
          <span className='p-4 lg:p-2 col-span-4 flex items-center lg:bg-slate-200'>
            {bikeDetails.displacement}
          </span>
          <span className='p-4 lg:p-2 col-span-2 flex items-center bg-slate-200 lg:bg-transparent font-semibold lg:pl-4'>
            Engine:{' '}
          </span>
          <span className='p-4 lg:p-2 col-span-4 flex items-center bg-slate-200 lg:bg-transparent'>
            {bikeDetails.engine}
          </span>
          <span className='p-4 lg:p-2 col-span-2 flex items-center font-semibold'>Cooling: </span>
          <span className='p-4 lg:p-2 col-span-4 flex items-center'>{bikeDetails.cooling}</span>

          <span className='p-4 lg:p-2 col-span-2 flex items-center bg-slate-200 lg:bg-slate-200 font-semibold lg:pl-4'>
            Power:{' '}
          </span>
          <span className='p-4 lg:p-2 col-span-4 flex items-center bg-slate-200 lg:bg-slate-200'>
            {bikeDetails.power}
          </span>
          <span className='p-4 lg:p-2 col-span-2 flex items-center lg:bg-slate-200 font-semibold'>
            Torque:{' '}
          </span>
          <span className='p-4 lg:p-2 col-span-4 flex items-center lg:bg-slate-200'>
            {bikeDetails.torque}
          </span>

          <span className='p-4 lg:p-2 col-span-2 flex items-center bg-slate-200 lg:bg-transparent font-semibold lg:pl-4'>
            Consumption:{' '}
          </span>
          <span className='p-4 lg:p-2 col-span-4 flex items-center bg-slate-200 lg:bg-transparent'>
            {bikeDetails.fuel_consumption}
          </span>
          <span className='p-4 lg:p-2 col-span-2 flex items-center font-semibold'>
            Tank capacity:{' '}
          </span>
          <span className='p-4 lg:p-2 col-span-4 flex items-center'>
            {bikeDetails.fuel_capacity}
          </span>

          <span className='p-4 lg:p-2 col-span-2 flex items-center bg-slate-200 lg:bg-slate-200 font-semibold lg:pl-4'>
            Gearbox:{' '}
          </span>
          <span className='p-4 lg:p-2 col-span-4 flex items-center bg-slate-200 lg:bg-slate-200'>
            {bikeDetails.gearbox}
          </span>
          <span className='p-4 lg:p-2 col-span-2 flex items-center lg:bg-slate-200 font-semibold'>
            Transmission:{' '}
          </span>
          <span className='p-4 lg:p-2 col-span-4 flex items-center lg:bg-slate-200'>
            {bikeDetails.transmission}
          </span>

          <span className='p-4 lg:p-2 col-span-2 flex items-center bg-slate-200 lg:bg-transparent font-semibold lg:pl-4'>
            Top speed:{' '}
          </span>
          <span className='p-4 lg:p-2 col-span-4 flex items-center bg-slate-200 lg:bg-transparent'>
            {bikeDetails.top_speed}
          </span>
          <span className='p-4 lg:p-2 col-span-2 flex items-center font-semibold'>
            Seat height:{' '}
          </span>
          <span className='p-4 lg:p-2 col-span-4 flex items-center'>{bikeDetails.seat_height}</span>

          <span className='p-4 lg:p-2 col-span-2 flex items-center bg-slate-200 lg:bg-slate-200 font-semibold lg:pl-4'>
            Dry weight:{' '}
          </span>
          <span className='p-4 lg:p-2 col-span-4 flex items-center bg-slate-200 lg:bg-slate-200'>
            {bikeDetails.dry_weight}
          </span>
          <span className='p-4 lg:p-2 col-span-2 flex items-center lg:bg-slate-200 font-semibold'>
            Wet weight:{' '}
          </span>
          <span className='p-4 lg:p-2 col-span-4 flex items-center lg:bg-slate-200'>
            {bikeDetails.total_weight}
          </span>
        </div>
      </section>
    </article>
  );
};

export default BikeDetails;
