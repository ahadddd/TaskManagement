import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { v4 as uuid } from "uuid";
import { CreateTaskDTO } from './DTO/create-task.dto';
import { GetTasksFilterDTO } from './DTO/get-tasks-filter.dto';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './task.repository';
import { UpdateTaskDTO } from './DTO/update-task.dto';

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

    createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }

    deleteTask(id: string): Promise<void> {
        return this.taskRepository.deleteTask(id);
    }

    updateTaskStatus(id: string, status: UpdateTaskDTO): Promise<Task> {
        return this.taskRepository.updateTask(id, status);
    }
}
