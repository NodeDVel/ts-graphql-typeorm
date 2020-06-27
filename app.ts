import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import * as morgan from 'morgan';
import { createConnection } from 'typeorm';

import connectionOptions from 'database';
import schema from './graphql/schema';

const app: express.Application = express();

createConnection(connectionOptions)
  .then(() => {
    console.log('DB Connection');
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

export default app;
