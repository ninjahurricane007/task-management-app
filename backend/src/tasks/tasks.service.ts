import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './tasks.entity';
import { TaskStatus } from './tasks.status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search, sort } = filterDto;

    const query = this.taskRepository.createQueryBuilder('task');
    query.where({ user });

    const statusArray: TaskStatus[] = Array.isArray(status)
      ? status
      : status
        ? [status]
        : [];

    if (statusArray.length) {
      query.andWhere('task.status IN (:...status)', { status: statusArray });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    switch (sort) {
      case 'Created First':
        query.orderBy('task.created_at', 'ASC');
        break;
      case 'Created Last':
        query.orderBy('task.created_at', 'DESC');
        break;
      case 'Modified First':
        query.orderBy('task.modified_at', 'ASC');
        break;
      case 'Modified Last':
        query.orderBy('task.modified_at', 'DESC');
        break;
    }

    return await query.getMany();
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id, user } });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.taskRepository.save(task);
    return task;
  }

  async deleteTaskById(id: string, user: User): Promise<string> {
    const result = await this.taskRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return 'Task deleted successfully';
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}
