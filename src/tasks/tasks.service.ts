import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from "uuid";
import { CreateTaskDTO } from './DTO/create-task.dto';
import { GetTasksFilterDTO } from './DTO/get-tasks-filter.dto';
import { filter } from 'rxjs';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTasksFilterDTO): Task[] {
        let tasks = this.getAllTasks();
        if (filterDto.status) {
            tasks = this.tasks.filter(task => task.status === filterDto.status)
        }

        if (filterDto.search) {
            tasks = this.tasks.filter((task) => {
                if (task.title.includes(filterDto.search) || task.description.includes(filterDto.search)) {
                    return true;
                }
                return false;
            })
        }

        return tasks;
    }

    getTaskById(id: string): Task {
        return this.tasks.find(item => item.id === id);
    }

    createTask(createTaskDto: CreateTaskDTO): Task {
        const task: Task = {
            id: uuid(),
            title: createTaskDto.title,
            description: createTaskDto.description,
            status: TaskStatus.DONE
        }

        this.tasks.push(task);

        return task;
    }

    deleteTask(id: string): Task[] {
        this.tasks.forEach((task, index) => {
            if (task.id === id) {
                this.tasks.splice(index, 1);
            }
        });
        return this.tasks;
    }

    updateTaskStatus(id: string, status: TaskStatus) {
        let task = this.getTaskById(id);
        task.status = status;
        return task;

    }
}
