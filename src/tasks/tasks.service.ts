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

    getTasks(filterDto: GetTasksFilterDTO): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto);
    }

    async getTaskById(id: string): Promise<Task> {
        const found = await this.taskRepository.findTaskById(id);
        return found;
    }

    createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    deleteTask(id: string): Promise<void> {
        return this.taskRepository.deleteTask(id);
    }

    updateTaskStatus(id: string, status: UpdateTaskDTO): Promise<Task> {
        return this.taskRepository.updateTask(id, status);
    }
}
