import { gql } from '@apollo/client';

import { Button } from 'flowbite-react';

import { map } from 'lodash';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { signIn } from 'next-auth/react';
import { NexusGenFieldTypes } from 'nexus-typegen';
import React from 'react';

import Auction from '@/components/Bikes/Auction';
import PricingData from '@/components/Bikes/PricingData';
import { getFakeAuctions } from '@/components/Bikes/PricingData/utils';
import Spec from '@/components/Bikes/Spec';

import { addApolloState, initializeApollo } from '@/lib/apollo';
import prisma from '@/lib/prisma';

const BIKE_DETAILS_QUERY = gql`
  query bikeDetailsQuery($id: String!) {
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
      auctionsRecent {
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

export async function getStaticPaths() {
  const bikes = await prisma.bike.findMany();
  const paths = map(bikes, ({ id }) => ({ params: { id } }));

  return {
    paths: paths,
    fallback: false // can also be true or 'blocking'
  };
}

export const getStaticProps: GetServerSideProps = async (context) => {
  const { params } = context;
  if (!params?.id) {
    return {
      notFound: true
    };
  }

  const apolloClient = initializeApollo(null, context);

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
    props: { bikeDetails: data.bikeDetails }
  });
};

type BikeDetailsProps = {
  bikeDetails: NexusGenFieldTypes['Bike'];
};

const BikeDetails: React.FC<BikeDetailsProps> = ({ bikeDetails }) => {
  const pageTitle = `${bikeDetails.make} ${bikeDetails.model} ${bikeDetails.year}`;
  const auctions = getFakeAuctions(bikeDetails.id);
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <article className='flex items-center flex-col gap-8'>
        <h1 className='text-2xl font-semibold text-blue-900 mt-4 mb-12'>
          {`Latest Deals for ${pageTitle}`}
        </h1>
        <section className='flex gap-6 flex-wrap justify-center max-w-6xl'>
          {bikeDetails?.auctionsRecent?.slice(0, 6).map((auction) => {
            if (!auction) {
              return null;
            }

            return <Auction auction={auction} key={auction.id} model={bikeDetails.model} />;
          })}
        </section>
        <div className='max-w-6xl lg:w-[72rem] flex items-center flex-col gap-8'>
          <h2 className='text-xl font-semibold text-blue-900 mt-12 mb-8'>Price analysis</h2>

          <div className='relative flex items-center flex-col gap-8'>
            <div className='absolute inset-0 z-50 flex justify-center items-start pt-40'>
              <div className='bg-white p-4 shadow-md rounded-md justify-center items-center flex flex-col gap-8'>
                <h3 className='text-lg font-semibold text-blue-900'>
                  You need to be a registered user to see the price analysis
                </h3>
                <Button onClick={() => signIn()}>Sign In</Button>
              </div>
            </div>
            <div className='blur-[6px] select-none flex flex-col gap-8'>
              <PricingData auctions={auctions} />
            </div>
          </div>
        </div>
        <h2 className='text-xl font-semibold text-blue-900 mt-12 mb-8'>Technical Specs</h2>
        <Spec bikeDetails={bikeDetails} />
      </article>
    </>
  );
};

export default BikeDetails;
