/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { TaskStatus } from './tasks.status.enum';
import { NotFoundException } from '@nestjs/common';

// It pretends to have a createQueryBuilder() method
// returns an object that allows chaining .where(), .andWhere(), and finally .getMany() to return mocked data.
const mockTasksRepository = () => ({
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(['mockTask1', 'mockTask2']),
  })),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  getTaskById: jest.fn(),
});

// A dummy user object
const mockUser = {
  username: 'someName',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};

const mockCreateTaskDto = {
  title: 'Test title',
  description: 'Test desc',
};

const mockTask = {
  id: 'testId',
  title: 'testTitle',
  description: 'testDescription',
  status: TaskStatus.OPEN,
};

describe('TasksService', () => {
  let tasksRepository;
  let tasksService: TasksService;

  // This runs before every test
  beforeEach(async () => {
    // create a fake NestJS module
    const module = await Test.createTestingModule({
      // registers TasksService and mocked repository
      providers: [
        TasksService,
        //telling use mock repository instead of actual repository
        {
          provide: getRepositoryToken(Task),
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();

    // saves both to variables so we can use them in the tests
    tasksService = module.get(TasksService);
    tasksRepository = module.get(getRepositoryToken(Task));
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      const result = await tasksService.getTasks({}, mockUser);
      expect(tasksRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(['mockTask1', 'mockTask2']);
    });
  });

  describe('getTaskById', () => {
    it('calls TaskRepository.findOne and returns the result', async () => {
      // Telling jest when findOne() is called inside the service during this test, don’t actually hit the database. Just instantly return mockTest as the result.
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('testId', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TaskRepository.findOne and handles an error', () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('testId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('calls TaskRepository.createTask and returns the result', async () => {
      tasksRepository.createTask.mockResolvedValue(mockTask);
      const result = await tasksService.createTask(mockCreateTaskDto, mockUser);
      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTaskById', () => {
    it('calls TaskRepository.delete and returns the result', async () => {
      tasksRepository.delete.mockResolvedValue('Task deleted successfully');
      const result = await tasksService.deleteTaskById('testId', mockUser);
      expect(result).toEqual('Task deleted successfully');
    });

    it('calls TaskRepository.delete and handles an error', () => {
      tasksRepository.delete.mockResolvedValue({ affected: 0 });
      expect(tasksService.deleteTaskById('testId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTaskStatus', () => {
    it('updates the task status successfully', async () => {
      const updatedTask = {
        ...mockTask,
        status: TaskStatus.DONE,
      };

      tasksRepository.findOne.mockResolvedValue(mockTask);
      tasksRepository.save.mockResolvedValue(updatedTask);

      const result = await tasksService.updateTaskStatus(
        'testId',
        TaskStatus.DONE,
        mockUser,
      );

      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'testId', user: mockUser },
      });
      expect(tasksRepository.save).toHaveBeenCalledWith({
        ...mockTask,
        status: TaskStatus.DONE,
      });
      expect(result).toEqual(updatedTask);
    });

    it('throws a NotFoundException if the task is not found', async () => {
      tasksRepository.findOne.mockResolvedValue(null);

      await expect(
        tasksService.updateTaskStatus('testId', TaskStatus.DONE, mockUser),
      ).rejects.toThrow(NotFoundException);

      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'testId', user: mockUser },
      });
      expect(tasksRepository.save).not.toHaveBeenCalled();
    });
  });
});
