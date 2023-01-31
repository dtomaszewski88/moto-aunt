import { extendType, nonNull, objectType, stringArg } from 'nexus';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id');
    t.string('name');
    t.string('email');
    t.field('emailVerified', {
      type: 'DateTime'
    });
    t.string('image');
    t.list.field('favourites', {
      type: 'Auction',
      async resolve(_parent, _args, ctx) {
        return ctx.prisma.user
          .findUnique({
            where: {
              id: _parent.id as string
            }
          })
          .auctions({
            orderBy: {
              createdOn: 'asc'
            }
          });
      }
    });
  }
});

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('user', {
      type: 'User',
      authorize: async (_root, _args, ctx) => Boolean(ctx.session),
      async resolve(_parent, _args, ctx) {
        const email = ctx?.session?.user?.email;
        if (!email) {
          return null;
        }

        return ctx.prisma.user.findUnique({
          where: {
            email
          }
        });
      }
    });
  }
});

export const AddFavouritesMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('addFavourites', {
      type: 'User',
      args: {
        id: nonNull(stringArg())
      },
      authorize: async (_root, _args, ctx) => Boolean(ctx.session),
      async resolve(_parent, args, ctx) {
        const { id } = args;
        const email = ctx?.session?.user?.email;
        if (!email) {
          return { id: '' };
        }

        return ctx.prisma.user.update({
          where: {
            email
          },
          data: {
            auctions: {
              connect: [{ id }]
            }
          }
        });
      }
    });
  }
});

export const RemoveFavouritesMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('removeFavourites', {
      type: 'User',
      args: {
        id: nonNull(stringArg())
      },
      authorize: async (_root, _args, ctx) => Boolean(ctx.session),
      async resolve(_parent, args, ctx) {
        const { id } = args;
        const email = ctx?.session?.user?.email;
        if (!email) {
          return { id: '' };
        }

        return ctx.prisma.user.update({
          where: {
            email
          },
          data: {
            auctions: {
              disconnect: [{ id }]
            }
          }
        });
      }
    });
  }
});
