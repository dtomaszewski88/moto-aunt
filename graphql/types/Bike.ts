import { extendType, objectType } from 'nexus';

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

export const BikesQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('bikes', {
      type: 'Bike',
      async resolve(_parent, _args, ctx: Context) {
        return ctx.prisma.bike.findMany();
      }
    });
  }
});
