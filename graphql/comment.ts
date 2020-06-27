import { gql } from 'apollo-server-express';
import { Board } from '../database/entities/Board.entity';
import { Comment } from '../database/entities/Comment.entity';
import { findByPk, User } from '../database/entities/User.entity';

import { verifyToken } from '@Lib/utils';
import { getRepository, Repository } from 'typeorm';

import CustomError from '@Lib/customError';
import { Verify } from 'crypto';

export const typeDef = gql`
type Comment {
  pk: Int!
  user_pk: String!
  board_pk: Int!
  content: String!
  createAt: Date!
  updateAt: Date!
}

extend type Query {
  comments(board_pk: Int!): [Comment]!
}

extend type Mutation {
  postComment(token: String!, board_pk: Int!, content: String!): Boolean!
  updateComment(token: String!, board_pk: Int!, comment_pk: Int!, content: String!): Boolean!
  deleteComment(token: String!, board_pk: Int!, comment_pk: Int!): Boolean!
}
`;

export const resolvers = {
  Query: {
    comments: async (_: any, {
      board_pk
    }: {
      board_pk: Board['pk'];
    }) => {
      const commentRepository: Repository<Comment> = getRepository(Comment);
      
      const comments: Comment[] = await commentRepository.find({
        where: {
          board_pk,
        },
      });

      if(!comments) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Not_Found_Comment' });
      }

      return comments;
    },
  },
  Mutation: {
    postComment: async (_: any, {
      board_pk,
      token,
      content
    }: {
      board_pk: Board['pk'];
      token: string;
      content: Comment['content'];
    }) => {
      const userRepository: Repository<User> = getRepository(User);
      const boardRepository: Repository<Board> = getRepository(Board);
      const commentRepository: Repository<Comment> = getRepository(Comment);

      const user_pk: User['pk'] = (verifyToken(token) as User).pk;

      const user: User = await findByPk(userRepository, user_pk);

      if(!user) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Not_Found_User' });
      }

      const board: Board = await boardRepository.findOne({
        where: {
          pk: board_pk,
        },
      });

      if(!board) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Not_Found_Board' });
      }

      await commentRepository.save({
        user_pk,
        board_pk,
        content,
      });

      return true;
    },
    updateComment: async (_: any, {
      token,
      board_pk,
      comment_pk,
      content,
    }: {
      token: string;
      board_pk: Board['pk'];
      comment_pk: Comment['pk'];
      content: Comment['content'];
    }) => {
      const userRepository: Repository<User> = getRepository(User);
      const boardRepository: Repository<Board> = getRepository(Board);
      const commentRepository: Repository<Comment> = getRepository(Comment);

      const pk: User['pk'] = (verifyToken(token) as User).pk;

      const user: User = await findByPk(userRepository, pk);

      if(!user) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Not_Found_User' });
      }

      const board: Board = await boardRepository.findOne({
        where: {
          pk: board_pk,
        },
      });

      if(!board) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Not_Found_Board' });
      }

      const comment: Comment = await commentRepository.findOne({
        where: {
          pk: comment_pk,
          board_pk,
        },
      });

      if(!comment) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Not_Found_Comment' });
      }

      if(comment.user_pk !== user.pk) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Forbidden' });
      }

      Object.assign(comment, { content });

      await comment.save().catch(err => console.log(err));

      return true;
    },
    deleteComment: async (_: any, {
      token,
      board_pk,
      comment_pk
    }: {
      token: string;
      board_pk: Board['pk'];
      comment_pk: Comment['pk'];
    }) => {
      const userRepository: Repository<User> = getRepository(User);
      const boardRepository: Repository<Board> = getRepository(Board);
      const commentRepository: Repository<Comment> = getRepository(Comment);

      const pk: User['pk'] = (verifyToken(token) as User).pk;

      const user: User = await findByPk(userRepository, pk);

      if(!user) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Not_Found_User' });
      }

      const board: Board = await boardRepository.findOne({
        where: {
          pk: board_pk,
        },
      });

      if(!board) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Not_Found_Board' });
      }

      const comment: Comment = await commentRepository.findOne({
        where: {
          pk: comment_pk,
        },
      });

      if(!comment) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Not_Found_Comment' });
      }

      if(comment.user_pk !== user.pk) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Forbidden' });
      }

      await comment.remove();

      return true;
    },
  },
};