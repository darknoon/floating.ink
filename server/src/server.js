import express from 'express';
import graphqlHTTP from 'express-graphql';
import { users, works } from './test-data';
import cors from 'cors';

import { schema, root } from './model';

var port = process.env.PORT || 4000;

var app = express();

// Enable CORS via cors module so we can run api server on a different domain :/
// graphiql will let people inspect the schema, which is fun :D
app.use('/graphql', cors(), graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(port);

console.log(`API server listening on port ${port}. graphiql available at /graphql`);
