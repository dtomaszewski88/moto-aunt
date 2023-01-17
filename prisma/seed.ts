import { PrismaClient } from '@prisma/client';
import { chain } from 'lodash';
import { pick } from 'lodash/fp';

import data from '../data/bmw.json';

const prisma = new PrismaClient();

type SeedBikeData = {
  make: string;
  model: string;
  type: string;
  year: number;
};

async function main() {
  const seedData = chain(data)
    .map((item) => ({ ...item, year: parseInt(item.year) }))
    .map(pick(['make', 'model', 'year', 'type']))
    .value() as SeedBikeData[];

  await prisma.bike.createMany({
    data: seedData
  });
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });
