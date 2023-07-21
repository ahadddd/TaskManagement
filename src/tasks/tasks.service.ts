import { Injectable } from '@nestjs/common';
import { CreateTaskDTO } from './DTO/create-task.dto';
import { GetTasksFilterDTO } from './DTO/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TasksRepository } from './task.repository';
import { UpdateTaskDTO } from './DTO/update-task.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {

    constructor(
        private taskRepository: TasksRepository
    ) {
    }

    getTasks(filterDto: GetTasksFilterDTO, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const found = await this.taskRepository.findTaskById(id, user);
        return found;
    }

    createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    deleteTask(id: string, user: User): Promise<void> {
        return this.taskRepository.deleteTask(id, user);
    }

    updateTaskStatus(id: string, status: UpdateTaskDTO, user: User): Promise<Task> {
        return this.taskRepository.updateTask(id, status, user);
    }
}
