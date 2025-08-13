import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { CheckSimilarityDto } from './dto/check-similarity-dto';
import { Task } from './tasks.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { Logger } from '@nestjs/common';
import { TaskAIService } from './tasks-ai.service';
import { GenerateTaskFromPromptDto } from './dto/generate-task-from-prompt.dto';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TaskController');
  constructor(
    private taskService: TasksService,
    private taskAIService: TaskAIService,
  ) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.taskService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<string> {
    return this.taskService.deleteTaskById(id, user);
  }

  @Patch('/:id/status')
  UpdateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.taskService.updateTaskStatus(id, status, user);
  }

  @Post('generate-from-prompt')
  GenerateTaskFromPrompt(
    @Body() generateTaskFromPromptDto: GenerateTaskFromPromptDto,
  ): Promise<{ title: string; description: string }> {
    return this.taskAIService.generateTaskFromPrompt(
      generateTaskFromPromptDto.prompt,
    );
  }

  @Post('check-similarity')
  checkSimilarity(
    @Body() checkSimilarityDto: CheckSimilarityDto,
  ): Promise<number> {
    return this.taskAIService.checkSimilarity(checkSimilarityDto);
  }
}
