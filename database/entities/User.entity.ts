import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm';

import CustomError from '@Lib/customError';

import { Board } from './Board.entity';
import { Comment } from './Comment.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public pk: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  public email: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  public password: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  public passwordKey: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  public name: string;

  @Column('timestamp')
  @CreateDateColumn()
  public createAt: Date;

  @Column('timestamp')
  @UpdateDateColumn()
  public updateAt: Date;

  @OneToMany((type) => Board, (board) => board.user)
  public board: Board[];

  @OneToMany((type) => Comment, (comment) => comment.user)
  public comment: Comment[];

}
  export const findByPk: (
    userRepository: Repository<User>, 
    pk: User['pk']
    ) => Promise<User> | undefined = async (userRepository, pk) => {
      const user: User = await userRepository.findOne({
        where: {
          pk,
        },
      });

      if(!user) {
        // tslint:disable-next-line: no-unused-expression
        new CustomError({ name: 'Database_Error' });
      }
      
      return user;
    } 
    
  export const findByEmail: (
    userRepository: Repository<User>,
    email: User['email']
  ) => Promise<User> | undefined = async (userRepository, email) => {
    const user: User = await userRepository.findOne({
      where: {
        email,
      },
    });

    if(!user) {
      // tslint:disable-next-line: no-unused-expression
      new CustomError({ name: 'Database_Error' });
    }

    return user;
  }