import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './DTO/create-task.dto';
import { GetTasksFilterDTO } from './DTO/get-tasks-filter.dto';
import { UpdateTaskDTO } from './DTO/update-task.dto';
import { Task } from './task.entity';
import { filter } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Get()
    getAllTasks(@Query() filterDto: GetTasksFilterDTO, @GetUser() user: User): Promise<Task[]> {
        return this.tasksService.getTasks(filterDto, user);
    }


    @Get('/:id')
    getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDTO, @GetUser() user: User): Promise<Task> {
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
        return this.tasksService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id') id: string, @Body() status: UpdateTaskDTO, @GetUser() user: User): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status, user);
    }

}
