import { ApolloCache, gql, useMutation } from '@apollo/client';
import { ArrowTopRightOnSquareIcon, StarIcon as StarIconSolid } from '@heroicons/react/20/solid';
import { StarIcon } from '@heroicons/react/24/outline';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { formatISOtoUTC } from '@/lib/utils';
import { NexusGenFieldTypes } from 'graphql/nexus-typegen';

type AuctionProps = {
  auction: NexusGenFieldTypes['Auction'];
  bikeId?: string;
  isLoading?: boolean;
  model?: NexusGenFieldTypes['Bike']['model'];
  onFavClick?: (arg: NexusGenFieldTypes['Auction']) => void;
};

const formatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'EUR'
});

type MutationResult = {
  addFavourites?: NexusGenFieldTypes['User'];
  removeFavourites?: NexusGenFieldTypes['User'];
};

const updateAuctionsCache = (
  cache: ApolloCache<unknown>,
  result: { data?: MutationResult | null }
) => {
  const { data } = result;
  const updatePayload = data?.addFavourites?.favourites;
  updatePayload?.forEach((auction) => {
    cache.writeQuery({
      query: gql`
        query UpdateFavourites($id: Int!) {
          auction(id: $id) {
            id
            isFavourite
          }
        }
      `,
      data: {
        auction
      },
      variables: {
        id: auction?.id
      }
    });
  });
};

const AUCTIONS_RECENT_QUERY = gql`
  query AuctionsRecentQuery($id: String!) {
    bikeDetails(id: $id) {
      id
      auctionsRecent {
        id
        isFavourite
      }
    }
  }
`;

const ADD_FAVOURITE_MUTATION = gql`
  mutation AddFavourites($auctionId: String!) {
    addFavourites(id: $auctionId) {
      id
      favourites {
        id
        isFavourite
      }
    }
  }
`;

const REMOVE_FAVOURITE_MUTATION = gql`
  mutation AddFavourites($auctionId: String!) {
    removeFavourites(id: $auctionId) {
      id
      favourites {
        id
        isFavourite
      }
    }
  }
`;

export const AuctionBasic: React.FC<AuctionProps> = ({ auction, isLoading, model, onFavClick }) => {
  return (
    <div className='rounded-md relative overflow-hidden' key={auction.id}>
      <div className='absolute top-0 left-0 right-0 bg-neutral-900 bg-opacity-75 text-blue-100  grid grid-cols-2 p-2'>
        <span>{formatISOtoUTC(auction.createdOn)}</span>
        <Link className='flex items-center gap-2 justify-self-end' href={auction.link as string}>
          {auction.domain} <ArrowTopRightOnSquareIcon className='w-4 h-4' />
        </Link>
      </div>
      <Image
        alt={model ?? ''}
        className=''
        height={240}
        src={`/images/${auction.imageUrl}`}
        width={360}
      />
      <div className='absolute bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-75 text-blue-100 text-center font-bold p-2 text-md'>
        {formatter.format(auction.price as number)}
      </div>
      {Boolean(onFavClick) && (
        <div className='absolute bottom-0 right-0 p-2 flex items-center justify-center'>
          <button
            className={clsx('text-white hover:text-blue-400', { 'animate-spin': isLoading })}
            type='button'
            onClick={() => onFavClick?.(auction)}>
            {auction.isFavourite ? (
              <StarIconSolid className='h-6 w-6' />
            ) : (
              <StarIcon className='h-6 w-6' />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const withFavourites = (Component: React.ComponentType<AuctionProps>) => {
  const displayName = Component.displayName || Component.name || 'Component';

  const AuctionWithFavourites = (props: AuctionProps) => {
    const { bikeId, ...rest } = props;

    const parentId = bikeId ?? props.auction.bike?.id;
    const [addFavorite, { loading: addLoading }] = useMutation(ADD_FAVOURITE_MUTATION, {
      update: updateAuctionsCache,
      refetchQueries: ['UserQuery', 'FavouriteAuctionsQuery']
    });

    const [removeFavourite, { loading: removeLoading }] = useMutation(REMOVE_FAVOURITE_MUTATION, {
      refetchQueries: [
        { query: AUCTIONS_RECENT_QUERY, variables: { id: parentId } },
        'UserQuery',
        'FavouriteAuctionsQuery'
      ]
    });

    const handleFavouriteClick = (auction: NexusGenFieldTypes['Auction']) => {
      if (auction.isFavourite) {
        removeFavourite({
          variables: {
            auctionId: auction.id
          }
        });
        return;
      }
      addFavorite({
        variables: {
          auctionId: auction.id
        }
      });
    };

    const isLoading = addLoading || removeLoading;
    return <Component {...rest} isLoading={isLoading} onFavClick={handleFavouriteClick} />;
  };

  AuctionWithFavourites.displayName = `withFavourites(${displayName})`;

  return AuctionWithFavourites;
};

const Auction = withFavourites(AuctionBasic);

export default Auction;
