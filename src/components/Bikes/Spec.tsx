import Image from 'next/image';

import React from 'react';
import { useIntl } from 'react-intl';

import { NexusGenFieldTypes } from 'graphql/nexus-typegen';

type BikeDetailsProps = {
  bikeDetails: NexusGenFieldTypes['Bike'];
};

const BikeDetails: React.FC<BikeDetailsProps> = ({ bikeDetails }) => {
  const { formatMessage: t } = useIntl();
  return (
    <section className='grid grid-cols-12 bg-white shadow-md rounded-md max-w-6xl'>
      <Image
        alt={bikeDetails.model ?? ''}
        className='rounded-tr-md rounded-tl-md lg:rounded-tr-none lg:rounded-bl-md lg:col-span-6 col-span-12 width-full'
        height={400}
        src={`/images/${bikeDetails.imageUrl}`}
        width={600}
      />
      <div className='grid lg:grid-cols-12 grid-cols-6 text-sm lg:text-xs lg:px-0 lg:col-span-6 col-span-12 justify-items-stretch'>
        <h3 className='lg:col-span-12 col-span-6 p-4 text-md lg:text-sm lg:p-1 font-bold flex items-center justify-center'>
          {t({ id: 'bikeDetails.specification' })}
        </h3>
        <span className='p-4 lg:p-2 col-span-2 flex items-center bg-slate-200 lg:bg-slate-200 font-semibold lg:pl-4'>
          {t({ id: 'bikeDetails.type' })}:
        </span>
        <span className='p-4 lg:p-2 col-span-4 flex items-center bg-slate-200 lg:bg-slate-200'>
          {bikeDetails.type}
        </span>
        <span className='p-4 lg:p-2 col-span-2 flex items-center lg:bg-slate-200 font-semibold'>
          {t({ id: 'bikeDetails.displacement' })}:
        </span>
        <span className='p-4 lg:p-2 col-span-4 flex items-center lg:bg-slate-200'>
          {bikeDetails.displacement}
        </span>
        <span className='p-4 lg:p-2 col-span-2 flex items-center bg-slate-200 lg:bg-transparent font-semibold lg:pl-4'>
          {t({ id: 'bikeDetails.engine' })}:
        </span>
        <span className='p-4 lg:p-2 col-span-4 flex items-center bg-slate-200 lg:bg-transparent'>
          {bikeDetails.engine}
        </span>
        <span className='p-4 lg:p-2 col-span-2 flex items-center font-semibold'>Cooling: </span>
        <span className='p-4 lg:p-2 col-span-4 flex items-center'>{bikeDetails.cooling}</span>

        <span className='p-4 lg:p-2 col-span-2 flex items-center bg-slate-200 lg:bg-slate-200 font-semibold lg:pl-4'>
          {t({ id: 'bikeDetails.power' })}:
        </span>
        <span className='p-4 lg:p-2 col-span-4 flex items-center bg-slate-200 lg:bg-slate-200'>
          {bikeDetails.power}
        </span>
        <span className='p-4 lg:p-2 col-span-2 flex items-center lg:bg-slate-200 font-semibold'>
          {t({ id: 'bikeDetails.torque' })}:
        </span>
        <span className='p-4 lg:p-2 col-span-4 flex items-center lg:bg-slate-200'>
          {bikeDetails.torque}
        </span>

        <span className='p-4 lg:p-2 col-span-2 flex items-center bg-slate-200 lg:bg-transparent font-semibold lg:pl-4'>
          {t({ id: 'bikeDetails.consumption' })}:
        </span>
        <span className='p-4 lg:p-2 col-span-4 flex items-center bg-slate-200 lg:bg-transparent'>
          {bikeDetails.fuel_consumption}
        </span>
        <span className='p-4 lg:p-2 col-span-2 flex items-center font-semibold'>
          {t({ id: 'bikeDetails.tankCapacity' })}:
        </span>
        <span className='p-4 lg:p-2 col-span-4 flex items-center'>{bikeDetails.fuel_capacity}</span>

        <span className='p-4 lg:p-2 col-span-2 flex items-center bg-slate-200 lg:bg-slate-200 font-semibold lg:pl-4'>
          {t({ id: 'bikeDetails.gearbox' })}:
        </span>
        <span className='p-4 lg:p-2 col-span-4 flex items-center bg-slate-200 lg:bg-slate-200'>
          {bikeDetails.gearbox}
        </span>
        <span className='p-4 lg:p-2 col-span-2 flex items-center lg:bg-slate-200 font-semibold'>
          {t({ id: 'bikeDetails.transmission' })}:
        </span>
        <span className='p-4 lg:p-2 col-span-4 flex items-center lg:bg-slate-200'>
          {bikeDetails.transmission}
        </span>

        <span className='p-4 lg:p-2 col-span-2 flex items-center bg-slate-200 lg:bg-transparent font-semibold lg:pl-4'>
          {t({ id: 'bikeDetails.topSpeed' })}:
        </span>
        <span className='p-4 lg:p-2 col-span-4 flex items-center bg-slate-200 lg:bg-transparent'>
          {bikeDetails.top_speed}
        </span>
        <span className='p-4 lg:p-2 col-span-2 flex items-center font-semibold'>Seat height: </span>
        <span className='p-4 lg:p-2 col-span-4 flex items-center'>{bikeDetails.seat_height}</span>

        <span className='p-4 lg:p-2 col-span-2 flex items-center bg-slate-200 lg:bg-slate-200 font-semibold lg:pl-4'>
          {t({ id: 'bikeDetails.dryWeight' })}:
        </span>
        <span className='p-4 lg:p-2 col-span-4 flex items-center bg-slate-200 lg:bg-slate-200'>
          {bikeDetails.dry_weight}
        </span>
        <span className='p-4 lg:p-2 col-span-2 flex items-center lg:bg-slate-200 font-semibold'>
          {t({ id: 'bikeDetails.wetWeight' })}:
        </span>
        <span className='p-4 lg:p-2 col-span-4 flex items-center lg:bg-slate-200'>
          {bikeDetails.total_weight}
        </span>
      </div>
    </section>
  );
};

export default BikeDetails;
