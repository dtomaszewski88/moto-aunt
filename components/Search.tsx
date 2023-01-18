import { gql, useQuery } from '@apollo/client';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Card, Spinner, TextInput } from 'flowbite-react';
import { NexusGenObjects } from 'nexus-typegen';
import { ChangeEventHandler, useState } from 'react';

const SEARCH_BIKES_QUERY = gql`
  query searchBikesQuery($search: String) {
    bikes(search: $search) {
      id
      make
      model
      year
      type
    }
  }
`;

export default function Search() {
  const [search, setSearch] = useState('');

  const { data, error, loading } = useQuery<{ bikes: NexusGenObjects['Bike'][] }>(
    SEARCH_BIKES_QUERY,
    { variables: { search }, skip: search.length < 3 }
  );

  const handleSetSearch: ChangeEventHandler<HTMLInputElement> = (evt) =>
    setSearch(evt.target.value);

  const isEmptyResult = data?.bikes.length === 0;

  return (
    <div className='min-w-[32rem] relative'>
      <TextInput
        className='font-bold'
        id='large'
        sizing='lg'
        type='text'
        value={search}
        onChange={handleSetSearch}
      />
      <div className='absolute right-0 top-0 bottom-0 flex items-center pr-4'>
        {loading && <Spinner />}
        {!loading && <MagnifyingGlassIcon className='w-8 h-8 text-blue-700' />}
      </div>
      {data && (
        <Card className='absolute mt-2 left-0 right-0'>
          {isEmptyResult && <p className='text-xl'>No results</p>}
          {data?.bikes?.map((bike) => (
            <div key={bike.id}>{`${bike.year} ${bike.make} ${bike.model}`}</div>
          ))}
        </Card>
      )}
    </div>
  );
}
