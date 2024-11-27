// src/users/entities/user.entity.ts

import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude() 
  @Column()
  password: string;

  @Column({ default: false })
  status: boolean;
}
