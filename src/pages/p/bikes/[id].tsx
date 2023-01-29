import { gql } from '@apollo/client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import React from 'react';
import { useIntl } from 'react-intl';

import Auction from '@/components/Bikes/Auction';
import PricingData from '@/components/Bikes/PricingData';
import Spec from '@/components/Bikes/Spec';

import { addApolloState, initializeApollo } from '@/lib/apollo';
import { NexusGenFieldTypes } from 'graphql/nexus-typegen';

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

export const getServerSideProps: GetServerSideProps = async (context) => {
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
    props: { bikeDetails: data.bikeDetails, auctions: data.auctions }
  });
};

type BikeDetailsProps = {
  auctions: NexusGenFieldTypes['Auction'][];
  bikeDetails: NexusGenFieldTypes['Bike'];
};

const BikeDetails: React.FC<BikeDetailsProps> = ({ auctions, bikeDetails }) => {
  const pageTitle = `${bikeDetails.make} ${bikeDetails.model} ${bikeDetails.year}`;

  const { formatMessage: t } = useIntl();
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <article className='flex items-center flex-col gap-8'>
        <h1 className='text-2xl font-semibold text-blue-900 mt-4 mb-12'>
          {t({ id: 'bikeDetails.title.latestDeals' }, { pageTitle })}
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
          <h2 className='text-xl font-semibold text-blue-900 mt-12 mb-8'>
            {t({ id: 'bikeDetails.title.priceData' })}
          </h2>
          <PricingData auctions={auctions} />
        </div>
        <h2 className='text-xl font-semibold text-blue-900 mt-12 mb-8'>
          {t({ id: 'bikeDetails.title.spec' })}
        </h2>
        <Spec bikeDetails={bikeDetails} />
      </article>
    </>
  );
};

export default BikeDetails;
