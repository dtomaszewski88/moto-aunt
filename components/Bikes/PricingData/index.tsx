import clsx from 'clsx';
import { countBy, filter } from 'lodash';

import { NexusGenFieldTypes } from 'nexus-typegen';
import React, { useMemo, useState } from 'react';

import AuctionsChart from 'components/Charts/AuctionsChart';
import PriceChart from 'components/Charts/PriceChart';

import AuctionsTable from './AuctionsTable';
import MainChartSummary from './MainChartHeader';
import { getAuctionData, getAvgPriceData } from './utils';

type PricingDataProps = {
  auctions: NexusGenFieldTypes['Auction'][];
};

const PricingData: React.FC<PricingDataProps> = ({ auctions }) => {
  const now = useMemo(() => new Date(), []);
  const [chartFilter, setChartFilter] = useState<Record<string, boolean>>({});

  const auctionData = useMemo(() => getAuctionData(auctions, now), [auctions, now]);
  const { meanByMonth, meanPrice, meanTotal } = useMemo(
    () => getAvgPriceData(auctions, now),
    [auctions, now]
  );

  const handleSetChartFilter = (evt: React.MouseEvent<HTMLDivElement>) => {
    const target = evt.currentTarget as HTMLDivElement;
    const filterKey = target.dataset.filterKey;
    if (!filterKey) {
      return;
    }

    const filterCount = countBy(chartFilter, Boolean);
    if (filterCount['true'] === auctionData.length - 1 && !chartFilter[filterKey]) {
      return;
    }

    setChartFilter((filter) => ({ ...filter, [filterKey]: !filter[filterKey] }));
  };

  const filteredAuctionData = useMemo(
    () => filter(auctionData, (data) => !chartFilter[data.domain]),
    [auctionData, chartFilter]
  );

  return (
    <>
      <section className='max-w-6xl flex flex-wrap gap-4'>
        {auctionData.map((auctionGroup) => {
          return (
            <div
              className={clsx('cursor-pointer transition-all select-none', {
                'grayscale opacity-50': chartFilter[auctionGroup.domain]
              })}
              data-filter-key={auctionGroup.domain}
              key={auctionGroup.domain}
              onClick={handleSetChartFilter}>
              <span className='leading-none p-1'>{auctionGroup.domain}</span>
              <div
                className={clsx(
                  `bg-${auctionGroup.color.name}`,
                  'h-2 rounded-md shadow-sm-light'
                )}></div>
            </div>
          );
        })}
      </section>
      <section className='grid max-w-6xl lg:w-[72rem] grid-cols-12 bg-white shadow-md rounded-md pt-4'>
        <PriceChart
          auctionsData={filteredAuctionData}
          avgPriceData={meanByMonth}
          className='col-span-12'
          totalAvgData={meanTotal}
        />
        <MainChartSummary auctions={auctions} />
      </section>
      <section className='grid max-w-6xl lg:w-[72rem] grid-cols-12 gap-8'>
        <AuctionsTable auctions={auctions} meanPrice={meanPrice} />
        <div className='col-span-4 row-span-2 min-h-[28rem]'>
          <AuctionsChart auctionsData={filteredAuctionData} />
        </div>
      </section>
    </>
  );
};

export default PricingData;
