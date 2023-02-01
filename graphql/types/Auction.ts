import { extendType, nonNull, objectType, stringArg } from 'nexus';

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
    t.field('isFavourite', {
      type: 'Boolean',
      resolve: async (_parent, _args, ctx) => {
        const email = ctx?.session?.user?.email;
        if (!email) {
          return false;
        }

        const user = await ctx.prisma.user.findUnique({
          where: {
            email
          }
        });

        if (!user) {
          return false;
        }

        const users = await ctx.prisma.auction
          .findUnique({
            where: {
              id: _parent.id as string
            }
          })
          .users({
            where: {
              id: user.id
            }
          });

        return Boolean(users?.length);
      }
    });
    t.field('bike', {
      type: 'Bike',
      resolve: async (_parent, _args, ctx) => {
        return await ctx.prisma.auction
          .findUnique({
            where: {
              id: _parent.id as string
            }
          })
          .bike();
      }
    });
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
      authorize: async (_parent, _args, ctx) => Boolean(ctx.session),
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
