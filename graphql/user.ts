import * as dotenv from 'dotenv';
import * as randomstring from 'randomstring';
import * as jwt from 'jsonwebtoken';

import { Repository, getRepository } from 'typeorm';
import { gql } from 'apollo-server-express';
import { pbkdf2, pbkdf2Sync, verify } from 'crypto';

import { User, findByPk, findByEmail } from '../database/entities/User.entity';
import { verifyToken } from '@Lib/utils';

import CustomError from '@Lib/customError';


dotenv.config();

export const typeDef = gql`
  type User {
    pk: String!
    email: String!
    password: String!
    password: String!
    name: String!
    createAt: Date!
    updateAt: Date!
  }

  type UserWithToken {
    user: User!
    token: String!
  }

  extend type Query {
    getUser(token: String): User!
  }

  extend type Mutation {
    register(email: String, password: String, passwordKey: String, name: String): Boolean!
    login(email: String, password: String): UserWithToken!
    updateUser(token: String, email: String, name: String, password: String): UserWithToken!
  }
`;

const PW_CONFIG: { ITERATION: number; KEY_LENGTH: number; DIGEST: string } = {
  ITERATION: parseInt(process.env.PASSWORD_ENCRYPTION_ITERATION, 10),
  KEY_LENGTH: parseInt(process.env.PASSWORD_ENCRYPTION_KEY_LENGTH, 10),
  DIGEST: process.env.PASSWORD_ENCRYPTION_DIGEST,
};

const passwordEncryption: (
  password: User['password'],
  passwordKey: User['passwordKey']
) => User['password'] = (password, passwordKey) => {
  const encryptionPassword: User['password'] = pbkdf2Sync(
    password,
    passwordKey,
    PW_CONFIG.ITERATION,
    PW_CONFIG.KEY_LENGTH,
    PW_CONFIG.DIGEST
  ).toString('base64');

  return encryptionPassword;
};

const issueToken: (pk: User['pk']) => string = pk => {
  const secretKey: string = process.env.TOKEN_SECRET;

  const token: string = jwt.sign(
    {
      pk,
    },
    secretKey,
    {
      expiresIn: '1h',
    },
  );

  return token;
}

export const resolvers = {
  Query: {
    getUser: async (_: any, { token }: { token: string }) => {
      const userRepository: Repository<User> = getRepository(User);

      const pk: User['pk'] = (verifyToken(token) as User).pk;

      const user: User = await findByPk(userRepository, pk);

      if(!user) {
        new CustomError({ name: 'Wrong_Data' });
      }
      return user;
    },
  },

  Mutation: {
    register: async (_: any, {
      email,
      password,
      name,
    }: {
      email: User['email'];
      password: User['password'];
      name: User['name'];
    }) => {
      const userRepository: Repository<User> = getRepository(User);

      await findByEmail(userRepository, email)
      .then((user: User) => {
        if(user) new CustomError({ name: 'Exist_Data' });
      });

      const passwordKey: User['passwordKey'] = randomstring.generate(64);
      const encryptionPassword: User['password'] = passwordEncryption(password, passwordKey);

      const user: User = await userRepository.save({
        email,
        password: encryptionPassword,
        passwordKey,
        name,
      });

      if(!user) new CustomError({ name: 'Database_Error' });

      return true;
    },
    login: async (_: any, {
      email,
      password,
    }: {
      email: User['email'];
      password: User['password'];
    }) => {
      const userRepository: Repository<User> = getRepository(User);

      const user: User = await findByEmail(userRepository, email);

      if(!user) new CustomError({ name: 'Wrong_Data' });

      const encryptionPassword: User['password'] = passwordEncryption(password, user.passwordKey);

      if(user.password !== encryptionPassword) {
        new CustomError({ name: 'Wrong_Data' });
      }

      const token: string = issueToken(user.pk);

      return { user, token };
    },
    updateUser: async (_: any, {
      token,
      email,
      password,
      name
    }: {
      token: string;
      email: User['email'];
      password: User['password'];
      name: User['name'];
    }) => {
      const userRepository: Repository<User> = getRepository(User);

      const { pk }: { pk: User['pk'] } = verifyToken(token) as User;

      const user: User = await findByPk(userRepository, pk);

      if(!user) {
        new CustomError({ name: 'Token_Expired' });
      }

      const encryptionPassword: User['password'] = passwordEncryption(password, user.passwordKey);

      Object.assign(user, { email, name, encryptionPassword });

      await user.save().catch(err => console.log(err));

      const issuedToken: string = issueToken(user.pk);

      return {
        user,
        token: issuedToken
      };
    },

  },
}