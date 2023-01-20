import { chain } from 'lodash';
import { extendType, nonNull, objectType, stringArg } from 'nexus';

import { Context } from 'graphql/context';

import { Auction } from './Auction';

export const Bike = objectType({
  name: 'Bike',
  definition(t) {
    t.nonNull.string('id');
    t.string('make');
    t.string('model');
    t.int('year');
    t.string('type');
    t.string('displacement');
    t.string('engine');
    t.string('power');
    t.string('torque');
    t.string('top_speed');
    t.string('cooling');
    t.string('gearbox');
    t.string('imageUrl');
    t.string('transmission');
    t.string('fuel_consumption');
    t.string('front_brakes');
    t.string('rear_brakes');
    t.string('dry_weight');
    t.string('total_weight');
    t.string('seat_height');
    t.string('fuel_capacity');
    t.field('auctionsCount', {
      type: 'Int',
      async resolve(_parent, _args, ctx) {
        const result = await ctx.prisma.bike.findUnique({
          where: {
            id: _parent.id as string
          },
          include: {
            _count: {
              select: { auctions: true }
            }
          }
        });
        return result?._count.auctions ?? null;
      }
    });
    t.list.field('auctions', {
      type: Auction,
      async resolve(_parent, _args, ctx) {
        return ctx.prisma.bike
          .findUnique({
            where: {
              id: _parent.id as string
            }
          })
          .auctions({
            orderBy: {
              price: 'asc'
            }
          });
      }
    });
  }
});

type BikesQueryArgs = {
  search?: string | null;
};

export const BikeDetailsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('bikeDetails', {
      type: 'Bike',
      args: {
        id: nonNull(stringArg())
      },
      async resolve(_parent, args, ctx) {
        const { id } = args;
        return ctx.prisma.bike.findUnique({
          where: {
            id
          }
        });
      }
    });
  }
});

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
        const select = {
          id: true,
          make: true,
          model: true,
          year: true,
          type: true
        };

        if (!search) {
          return ctx.prisma.bike.findMany({
            take: 20,
            select
          });
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
          take: 10,
          select
        });
      }
    });
  }
});
