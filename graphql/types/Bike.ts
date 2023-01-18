import { chain } from 'lodash';
import { extendType, objectType, stringArg } from 'nexus';

import { Context } from 'graphql/context';

export const Bike = objectType({
  name: 'Bike',
  definition(t) {
    t.string('id');
    t.string('make');
    t.string('model');
    t.int('year');
    t.string('type');
  }
});

type BikesQueryArgs = {
  search?: string | null;
};

export const BikesQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('bikes', {
      type: 'Bike',
      args: {
        search: stringArg()
      },

      async resolve(_parent, args: BikesQueryArgs, ctx: Context) {
        const { search } = args;

        if (!search) {
          return ctx.prisma.bike.findMany({ take: 20 });
        }

        const searchTerms = chain(search)
          .split(' ')
          .compact()
          .map((searchTerm) => [
            { model: { contains: searchTerm } },
            { make: { contains: searchTerm } }
          ])
          .flatten()
          .value();

        return ctx.prisma.bike.findMany({
          where: {
            OR: searchTerms
          },
          take: 10
        });
      }
    });
  }
});
