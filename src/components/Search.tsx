import { gql, useQuery } from '@apollo/client';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { Badge, Spinner, TextInput } from 'flowbite-react';
import Link from 'next/link';

import { ChangeEventHandler, useCallback, useEffect, useRef, useState } from 'react';

import { useIntl } from 'react-intl';

import { NexusGenFieldTypes } from 'graphql/nexus-typegen';

const SEARCH_BIKES_QUERY = gql`
  query searchBikesQuery($search: String) {
    bikes(search: $search) {
      id
      make
      model
      year
      type
      auctionsCount
    }
  }
`;

type SearchProps = {
  size?: 'sm' | 'md' | 'lg';
};

export default function Search(props: SearchProps) {
  const { formatMessage: t } = useIntl();
  const { size = 'lg' } = props;
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { data, loading } = useQuery<{ bikes: NexusGenFieldTypes['Bike'][] }>(SEARCH_BIKES_QUERY, {
    variables: { search },
    skip: search.length < 3
  });

  const handleSetSearch: ChangeEventHandler<HTMLInputElement> = (evt) =>
    setSearch(evt.target.value);

  const isEmptyResult = data?.bikes.length === 0;

  useEffect(() => {
    if (!data || loading) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
  }, [setIsOpen, data, loading]);

  const handleBlur = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => setIsOpen(false), 100);
  }, [setIsOpen]);

  return (
    <div className={clsx('relative', { 'min-w-[32rem]': size === 'lg' })}>
      <TextInput
        className='font-bold'
        id='bike-search'
        placeholder={t({ id: 'home.searchPlaceholder' })}
        sizing={size}
        type='text'
        value={search}
        onBlur={handleBlur}
        onChange={handleSetSearch}
      />
      <div className='absolute right-0 top-0 bottom-0 flex items-center pr-4'>
        {loading && <Spinner />}
        {!loading && (
          <MagnifyingGlassIcon
            className={clsx('text-blue-700', {
              'w-8 h-8': size === 'lg',
              'w-5 h-5': size !== 'lg'
            })}
          />
        )}
      </div>
      {isOpen && (
        <div className='absolute mt-2 left-0 right-0 px-0 bg-white rounded-md shadow-md py-2 z-50'>
          {isEmptyResult && <p className='text-md text-blue-900 p-4'>No results</p>}
          {!isEmptyResult && (
            <ul>
              {data?.bikes?.map((bike) => (
                <li key={bike.id}>
                  <Link
                    className='flex px-4 py-2 hover:bg-blue-50 justify-between items-center'
                    href={`/bikes/${bike.id}`}>
                    <span className='whitespace-nowrap overflow-ellipsis max-w-[80%]'>{`${bike.year} ${bike.make} ${bike.model}`}</span>
                    <Badge className='whitespace-nowrap' color='success'>
                      {t({ id: 'common.Xoffers' }, { amount: bike.auctionsCount })}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
