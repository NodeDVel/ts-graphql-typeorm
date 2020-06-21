import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import { User } from '../database/entities/User.entity';
import  CustomError  from './customError';

dotenv.config();

export const verifyToken : (token: string) => User | void = token => {
  const secretKey: string = process.env.TOKEN_SECRET;

  const decoded: User | void = jwt.verify(
    token,
    secretKey,
    (err: jwt.JsonWebTokenError, result) => {
      if (err) {
        switch (err.name) {
          case 'JsonWebTokenError':
            console.log(1);
            // tslint:disable-next-line: no-unused-expression
            new CustomError({ name: 'Token_Expired' });
          case 'TokenExpiredError':
            // tslint:disable-next-line: no-unused-expression
            new CustomError({ name: 'Token_Expired' })
          case 'NotBeforeError':
            // tslint:disable-next-line: no-unused-expression
            new CustomError({ name: 'Token_Expired' })
          default:
            // tslint:disable-next-line: no-unused-expression
            new CustomError({ name: 'Token_Expired' })
        }
      }   

      return result;
    }
  );

  return decoded;
};