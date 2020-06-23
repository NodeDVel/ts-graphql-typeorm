import { gql } from 'apollo-server-express';
import { Board } from '../database/entities/Board.entity';
import { findByPk, User } from '../database/entities/User.entity';

import { verifyToken } from '@Lib/utils';
import { getRepository, Repository } from 'typeorm';

import CustomError from '@Lib/customError';

export const typeDef = gql`
type Board {
  pk: Int!
  user_pk: String!
  user_name: String!
  title: String!
  content: String!
  comment: [Comment]!
  isWrite: Boolean!
  createAt: Date!
  updateAt: Date!
}

extend type Query {
  board(board_pk: Int!, token: String!): Board!
  boards(token: String!): [Board]!
  myBoard(token: String!): [Board]!
}

extend type Mutation {
  postBoard(token: String!, title: String!, content: String!): Boolean!
  updateBoard(board_pk: Int!, title: String, content: String, token: String!): Boolean!
  deleteBoard(board_pk: Int!, token: String!): Boolean!
}
`;

export const resolvers = {
  Query: {
    board: async (_: any, {
      board_pk,
      token
    }: {
      board_pk: Board['pk'];
      token: string | undefined;
    }) => {
      const boardRepository: Repository<Board> = getRepository(Board);
      const user_pk: User['pk'] = token ? (verifyToken(token) as User).pk : undefined; 

      const board: Board = await boardRepository.findOne({
        where: {
          pk: board_pk,
        },
        relations: ['user', 'comment'],
      });

      if(!board) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Not_Found_Board' });
      }

      return {
        pk: board.pk,
        user_pk: board.user_pk,
        user_name: board.user.name,
        title: board.title,
        content: board.content,
        isWrite: board.user_pk === user_pk,
        comment: board.comment,
        createAt: board.createdAt,
        updateAt: board.updatedAt,
      };
    },
    boards: async (_: any, { token }: { token: string }) => {
      const userRepository: Repository<User> = getRepository(User);
      const boardRepository: Repository<Board> = getRepository(Board);

      const pk: User['pk'] = (verifyToken(token) as User).pk;

      const user: User = await findByPk(userRepository, pk);

      if(!user) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Wrong_Data' });
      }

      const board: Board[] = await boardRepository.find({
        relations: ['user', 'comment', 'comment.user'],
        order: {
          createdAt: 'DESC',
        },
      });

      if(!board) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Database_Error' });
      }

      return board.map((board) => ({
        pk: board.pk,
        user_pk: board.user_pk,
        user: board.user,
        title: board.title,
        content: board.content,
        comment: board.comment,
        createAt: board.createdAt,
        updateAt: board.updatedAt,
      }));  
    },
    myBoard: async (_: any, { token }: { token: string }) => {
      const boardRepository: Repository<Board> = getRepository(Board);
      const userRepository: Repository<User> = getRepository(User);

      const pk: User['pk'] = (verifyToken(token) as User).pk;

      const user: User = await findByPk(userRepository, pk);

      if(!user) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Not_User' });
      }

      const board: Board[] = await boardRepository.find({
        where: {
          user_pk: user.pk,
        },
      });

      if(!board) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Database_Error' });
      } else if(!board.length) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Not_Found_Board' });
      }

      return board;
    }
  },
  Mutation: {
    postBoard: async (_: any, {
      token,
      title,
      content
    }: {
      token: string;
      title: Board['title'];
      content: Board['content'];
    }) => {
      const boardRepository: Repository<Board> = getRepository(Board);
      const userRepository: Repository<User> = getRepository(User);

      const pk: User['pk'] = (verifyToken(token) as User).pk;
      const user: User = await findByPk(userRepository, pk); 

      if(!user) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Not_User' });
      }

      await boardRepository.save({
        user_pk: user.pk,
        title,
        content
      }).catch(err => console.log(err));

      return true;
    },
    updateBoard: async (_: any, {
      board_pk,
      title,
      content,
      token
    }: {
      board_pk: Board['pk'];
      title: Board['title'] | undefined;
      content: Board['content'] | undefined;
      token: string;
    }) => {
      const boardRepository: Repository<Board> = getRepository(Board);

      const user_pk: User['pk'] = (verifyToken(token) as User).pk;

      const board: Board = await boardRepository.findOne({
        where: {
          pk: board_pk,
        },
      });

      if(!board) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Not_Found_Board' });
      }

      if(board.user_pk !== user_pk) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Forbidden' });
      }

      Object.assign(board, { title, content });

      await board.save().catch(err => console.log(err));

      return true;

    },
    deleteBoard: async (_: any, {
      board_pk,
      token
    }: {
      board_pk: Board['pk'];
      token: string;
    }) => {
      const boardRepository: Repository<Board> = getRepository(Board);
    
      const user_pk: User['pk'] = (verifyToken(token) as User).pk;

      const board: Board = await boardRepository.findOne({
        where: {
          pk: board_pk,
        },
      });

      if(!board) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Not_Found_Board' });
      }

      if(board.user_pk !== user_pk) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Forbidden' });
      }

      await board.remove().catch(err => console.log(err));

      return true;
    },
  },
};