import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

export const serializeDates = (dateFields: string[]) => (entry: Record<string, unknown | Date>) =>
  dateFields.reduce(
    (result, dateField) => ({
      ...result,
      [dateField]: (entry[dateField] as Date)?.toISOString()
    }),
    entry
  );

export const getAllBikeIds = async () => await prisma.bike.findMany({ select: { id: true } });
export const getBikeDetails = async (id: string) => {
  const bikeDetails = await prisma.bike.findUnique({
    where: {
      id
    }
  });

  const auctions = await prisma.bike
    .findUnique({
      where: {
        id: id
      }
    })
    .auctions({
      orderBy: {
        createdOn: 'asc'
      },
      take: 6
    });

  const auctionsRecent = auctions?.map(serializeDates(['createdOn']));

  return { ...bikeDetails, auctionsRecent };
};

export default prisma;
