import { extendType, intArg, nonNull, objectType, stringArg } from 'nexus';

export const Auction = objectType({
  name: 'Auction',
  definition(t) {
    t.nonNull.string('id');
    t.string('link');
    t.string('imageUrl');
    t.field('createdOn', {
      type: 'DateTime'
    });
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
        bikeId: nonNull(stringArg()),
        page: intArg()
      },
      authorize: async (_root, _args, ctx) => Boolean(ctx.session),
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
