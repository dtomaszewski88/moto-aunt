// /graphql/schema.ts
import { join } from 'path';

import { fieldAuthorizePlugin, makeSchema } from 'nexus';

import * as types from './types';

export const schema = makeSchema({
  types,
  outputs: {
    typegen: join(process.cwd(), 'graphql', 'nexus-typegen.d.ts'),
    schema: join(process.cwd(), 'graphql', 'schema.graphql')
  },
  contextType: {
    export: 'Context',
    module: join(process.cwd(), 'graphql', 'context.ts')
  },
  plugins: [fieldAuthorizePlugin()]
});
