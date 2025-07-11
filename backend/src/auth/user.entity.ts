/* eslint-disable @typescript-eslint/no-unused-vars */
import { Task } from '../tasks/tasks.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // underscore is added so that it will not complain about unused variables
  // eager is set true as we need to fetch the tasks whenever we fetch a user
  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];
}
