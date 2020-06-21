import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Board } from './Board.entity';
import { User } from './User.entity';

@Entity('comments')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  public pk: number;

  @Column({ type: 'uuid', length: 36, nullable: false })
  public user_pk: string;

  @Column({ type: 'unsigned big int', length: 36, nullable: false })
  public board_pk: number;

  @Column({ type: 'text', nullable: false })  
  public content: string;

  @Column({ type: 'timestamptz' })
  @CreateDateColumn()
  public createdAt: string;

  @Column({ type: 'timestamptz' })
  @UpdateDateColumn()
  public updatedAt: string;

  @ManyToOne((type) => User, {
    cascade: true,
  })
  @JoinColumn({ name: 'user_pk' })
  public user: User;

  @ManyToOne((type) => Board, {
    cascade: true,
  })
  @JoinColumn({ name: 'board_pk' })
  public board: Board;
}