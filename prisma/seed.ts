import { rand, randNumber, randPastDate, randSlug, randUrl, seed } from '@ngneat/falso';
import { PrismaClient } from '@prisma/client';

import { chain, times } from 'lodash';
import { pick } from 'lodash/fp';
import { v4 as id } from 'uuid';

import data1 from '../data/bmw30.json';
import data2 from '../data/yamaha30.json';

const prisma = new PrismaClient();

type SeedBikeData = {
  cooling: string;
  displacement: string;
  dry_weight: string;
  engine: string;
  front_brakes: string;
  fuel_capacity: string;
  fuel_consumption: string;
  gearbox: string;
  id: string;
  imageUrl?: string;
  make: string;
  model: string;
  power: string;
  rear_brakes: string;
  seat_height: string;
  top_speed: string;
  torque: string;
  total_weight: string;
  transmission: string;
  type: string;
  year: number;
};

type SeedAuctionData = {
  bikeId: string;
  createdOn: string;
  domain: string;
  id: string;
  imageUrl?: string;
  link: string;
  price: number;
};

async function main() {
  seed('some-constant-seed');
  const bikeImages = ['bike01.png'];
  const auctionImages = ['bike01.png'];
  const auctionDomains = randUrl({ length: 10 });

  const bikeSeedData = chain([...data1, ...data2])
    .shuffle()
    .slice(0, 2)
    .map((item) => ({ ...item, year: parseInt(item.year), id: id(), imageUrl: rand(bikeImages) }))
    .map(
      pick([
        'id',
        'imageUrl',
        'make',
        'model',
        'year',
        'type',
        'displacement',
        'engine',
        'power',
        'torque',
        'top_speed',
        'cooling',
        'gearbox',
        'transmission',
        'fuel_consumption',
        'front_brakes',
        'rear_brakes',
        'dry_weight',
        'total_weight',
        'seat_height',
        'fuel_capacity'
      ])
    )
    .value() as SeedBikeData[];

  const auctionSeedData = chain(bikeSeedData)
    .reduce<SeedAuctionData[]>((result, current) => {
      const auctionCount = randNumber({ min: 5, max: 15 });
      const basePrice = randNumber({ min: 1000, max: 20000 });
      times(auctionCount, () => {
        const domain = rand(auctionDomains);

        result.push({
          id: id(),
          imageUrl: rand(auctionImages),
          bikeId: current.id,
          domain: domain,
          link: `${domain}/${randSlug()}`,
          price: basePrice * randNumber({ min: 0.5, max: 1.5, fraction: 3 }),
          createdOn: randPastDate().toISOString()
        });
      });
      return result;
    }, [])
    .value();

  console.log(`SEEDING BIKE TABLE WITH ${bikeSeedData.length} records`);
  const bikes = await prisma.bike.createMany({
    data: bikeSeedData
  });

  console.log(`SEEDED: `, bikes);

  console.log(`SEEDING AUCTIONS TABLE WITH ${auctionSeedData.length} records`);
  const auctions = await prisma.auction.createMany({
    data: auctionSeedData
  });
  console.log(`SEEDED: `, auctions);
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });
