import { format as formatFNS, parseISO } from 'date-fns';
import { format, formatInTimeZone } from 'date-fns-tz';
import { Button } from 'flowbite-react';
// import { format as formatFNS, parseISO } from 'date-fns';
import { map } from 'lodash';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { signIn } from 'next-auth/react';

import React from 'react';

import Auction from '@/components/Bikes/Auction';
import PricingData from '@/components/Bikes/PricingData';
import Spec from '@/components/Bikes/Spec';

import { addApolloState, initializeApollo } from '@/lib/apollo';
import { getAllBikeIds, getBikeDetails } from '@/lib/prisma';
import fakeAuctions from 'data/fakeAuctions.json';
import { NexusGenFieldTypes } from 'graphql/nexus-typegen';

export async function getStaticPaths() {
  const bikes = await getAllBikeIds();
  const paths = map(bikes, ({ id }) => ({ params: { id } }));

  return {
    paths: paths,
    fallback: 'blocking' // can also be true or 'blocking'
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

  const bikeDetails = await getBikeDetails(params.id as string);

  if (!bikeDetails) {
    return {
      notFound: true
    };
  }

  return addApolloState(apolloClient, {
    props: { bikeDetails }
  });
};

type BikeDetailsProps = {
  bikeDetails: NexusGenFieldTypes['Bike'];
};

const BikeDetails: React.FC<BikeDetailsProps> = ({ bikeDetails }) => {
  const pageTitle = `${bikeDetails.make} ${bikeDetails.model} ${bikeDetails.year}`;

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
          {bikeDetails?.auctionsRecent?.map((auction) => {
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
              <PricingData auctions={fakeAuctions} />
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
