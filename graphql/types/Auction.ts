import { objectType } from 'nexus';

export const Auction = objectType({
  name: 'Auction',
  definition(t) {
    t.nonNull.string('id');
    t.string('link');
    t.float('price');
  }
});
