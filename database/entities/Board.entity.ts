import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Comment } from './Comment.entity';
import { User } from './User.entity';

@Entity('boards')
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  public pk: number;

  @Column({ type: 'uuid', length: 36, nullable: false })
  public user_pk: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  public title: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  public content: string;

  @Column({ type: 'timestamp' })
  @CreateDateColumn()
  public createdAt: Date;

  @Column({ type: 'timestamp' })
  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({ type: 'timestamp' })
  @DeleteDateColumn()
  public deletedAt: Date;

  @ManyToOne(type => User, {
    cascade: true,
  })
  @JoinColumn({ name: 'user_pk' })
  public user: User;

  @OneToMany((type) => Comment, (comment) => comment.board)
  public comment: Comment[];

}