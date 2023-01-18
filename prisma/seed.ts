import { PrismaClient } from '@prisma/client';
import { chain } from 'lodash';
import { pick } from 'lodash/fp';

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

async function main() {
  const seedData = chain([...data1, ...data2])
    .map((item) => ({ ...item, year: parseInt(item.year) }))
    .map(
      pick([
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
