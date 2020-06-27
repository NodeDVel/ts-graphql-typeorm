import { ConnectionOptions } from 'typeorm';

import * as dotenv from 'dotenv';

import { Board } from './entities/Board.entity';
import { Comment } from './entities/Comment.entity';
import { User } from './entities/User.entity';

dotenv.config();

const DB_CONFIG = {
  DB_NAME: process.env.DB_NAME || undefined,
  DB_HOST: process.env.DB_HOST || undefined,
  DB_USERNAME: process.env.DB_USERNAME || undefined,
  DB_PASSWORD: process.env.DB_PASSWORD || undefined
};

const connectionOptions: ConnectionOptions = {
  entities: [User, Board, Comment],
  type: 'mysql',
  host: DB_CONFIG.DB_HOST,
  database: DB_CONFIG.DB_NAME,
  username: DB_CONFIG.DB_USERNAME,
  password: DB_CONFIG.DB_PASSWORD,
  port: 3000,
  synchronize: true,
  logging: true
};

export default connectionOptions;