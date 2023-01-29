import { differenceInDays, parseISO, sub } from 'date-fns';
import { chain, findLast, map, meanBy, times } from 'lodash';

import resolveConfig from 'tailwindcss/resolveConfig';

import { formatISOtoUTC, formatToUTC } from '@/lib/utils';
import { NexusGenFieldTypes } from 'graphql/nexus-typegen';

import tailwindConfig from 'tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);

const twcolors = (fullConfig.theme?.colors as Record<string, string>) ?? {};

export const colors = [
  { value: twcolors['blue']['900'], name: 'blue-900' },
  { value: twcolors['red']['600'], name: 'red-600' },
  { value: twcolors['orange']['500'], name: 'orange-500' },
  { value: twcolors['amber']['500'], name: 'amber-500' },
  { value: twcolors['indigo']['500'], name: 'indigo-500' },
  { value: twcolors['yellow']['300'], name: 'yellow-300' },
  { value: twcolors['lime']['200'], name: 'lime-200' },
  { value: twcolors['green']['500'], name: 'green-500' },
  { value: twcolors['emerald']['500'], name: 'emerald-500' },
  { value: twcolors['teal']['500'], name: 'teal-500' },
  { value: twcolors['violet']['500'], name: 'violet-500' },
  { value: twcolors['purple']['500'], name: 'purple-500' },
  { value: twcolors['fuchsia']['500'], name: 'fuchsia-500' },
  { value: twcolors['rose']['500'], name: 'rose-500' }
];

export const getAuctionData = (auctions: NexusGenFieldTypes['Auction'][], baseDate: Date) => {
  return chain(auctions)
    .groupBy('domain')
    .map((auctionGroup, key) => {
      return {
        domain: key,
        points: map(auctionGroup, (auction) => ({
          label: `${auction.domain} / ${formatISOtoUTC(auction.createdOn)}`,
          x: differenceInDays(parseISO(auction.createdOn), baseDate) as number,
          y: auction.price as number
        }))
      };
    })
    .orderBy(['auctionCount'], ['desc'])
    .map((auctionGroup, index) => {
      return {
        ...auctionGroup,
        color: colors[index]
      };
    })
    .value();
};

export const getAvgPriceData = (
  auctions: NexusGenFieldTypes['Auction'][],
  baseDate: Date,
  totalMonts = 12
) => {
  const meanPrice = meanBy(auctions, 'price');

  const groupedData = chain(auctions)
    .groupBy((auction) => formatISOtoUTC(auction.createdOn, 'yyyy-MM'))
    .value();

  const meanByMonth = chain(totalMonts)
    .times((index) => formatToUTC(sub(baseDate, { months: index }), 'yyyy-MM'))
    .reverse()
    .map((dataPoint, index) => {
      const entries = groupedData[dataPoint];

      return {
        label: dataPoint,
        y: meanBy(entries, 'price'),
        x: index
      };
    })
    .map((dataPoint, index, array) => {
      if (dataPoint.y) {
        return dataPoint;
      }
      const fallback = findLast(array, (item) => Boolean(item.y), index);
      return {
        ...dataPoint,
        y: fallback?.y ?? 0
      };
    })
    .value();

  const meanTotal = times(totalMonts, (index) => ({
    x: index,
    y: meanPrice
  }));

  return {
    meanTotal,
    meanByMonth,
    meanPrice
  };
};
