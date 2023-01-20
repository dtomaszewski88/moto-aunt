import { extendType, nonNull, objectType, stringArg } from 'nexus';

export const Auction = objectType({
  name: 'Auction',
  definition(t) {
    t.nonNull.string('id');
    t.string('link');
    t.string('imageUrl');
    t.datetime('createdOn');
    t.string('domain');
    t.float('price');
  }
});

export const AuctionsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('auctions', {
      type: 'Auction',
      args: {
        bikeId: nonNull(stringArg())
      },
      async resolve(_parent, args, ctx) {
        const { bikeId } = args;
        return ctx.prisma.auction.findMany({
          where: {
            bikeId
          },
          orderBy: {
            createdOn: 'asc'
          }
        });
      }
    });
  }
});
