import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { getSession } from 'next-auth/react';
import React from 'react';
import { useIntl } from 'react-intl';

import Auction from '@/components/Bikes/Auction';

import { addApolloState, initializeApollo } from '@/lib/apollo';
import { NexusGenFieldTypes } from 'graphql/nexus-typegen';

const FAVOURITE_AUCTIONS_QUERY = gql`
  query FavouriteAuctionsQuery {
    user {
      favourites {
        id
        link
        price
        imageUrl
        createdOn
        domain
        isFavourite
        bike {
          id
          model
        }
      }
    }
  }
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;

  const session = getSession({ req });
  if (!session) {
    return {
      redirect: {
        status: 307,
        destination: '/'
      }
    };
  }

  const apolloClient = initializeApollo(null, context);

  const { data } = await apolloClient.query({
    query: FAVOURITE_AUCTIONS_QUERY
  });

  return addApolloState(apolloClient, {
    props: { auctions: data.user.favourites }
  });
};

type BikeDetailsProps = {
  auctions: NexusGenFieldTypes['Auction'][];
};

const BikeDetails: React.FC<BikeDetailsProps> = () => {
  const { formatMessage: t } = useIntl();
  const { data } = useQuery<{ user: { favourites: NexusGenFieldTypes['Auction'][] } }>(
    FAVOURITE_AUCTIONS_QUERY
  );
  return (
    <>
      <Head>
        <title>{t({ id: 'favourites.pageTitle' })}</title>
      </Head>
      <article className='flex items-center flex-col gap-8'>
        <h1 className='text-2xl font-semibold text-blue-900 mt-4 mb-12'>
          {t({ id: 'favourites.title' })}
        </h1>
        <section className='flex gap-6 flex-wrap justify-center max-w-6xl'>
          {data?.user?.favourites?.map((auction) => {
            return <Auction auction={auction} key={auction.id} model={auction.bike?.model} />;
          })}
        </section>
      </article>
    </>
  );
};

export default BikeDetails;
