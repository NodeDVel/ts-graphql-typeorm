import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';

import * as Board from './board';
import * as Comment from './comment';
import * as User from './user';

import { gql } from 'apollo-server-express';

const typeDef = gql`
  scalar Date
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

const resolvers = {
  Query: {},
  Mutation: {}
};

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [typeDef, User.typeDef, Board.typeDef, Comment.typeDef],
  resolvers: merge(resolvers, User.resolvers, Board.resolvers, Comment.resolvers)

});

export default schema;