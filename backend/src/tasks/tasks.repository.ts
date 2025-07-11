//entity repository is now depricated

import { EntityRepository, Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks.status.enum';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);
    return task;
  }
}
