import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDTO } from "./DTO/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateTaskDTO } from "./DTO/update-task.dto";
import { GetTasksFilterDTO } from "./DTO/get-tasks-filter.dto";
import { filter } from "rxjs";
import { User } from "src/auth/user.entity";

@Injectable()
export class TasksRepository {

    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ) { }

    async getTasks(filterDto: GetTasksFilterDTO): Promise<Task[]> {
        const query = this.taskRepository.createQueryBuilder('task');

        const {status, search} = filterDto;

        if(status) {
            query.andWhere('task.status = :status', {status})
        }

        if(search) {
            query.andWhere(
                'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
                {search: `%${search}%`}
            );
        }

        const tasks = await query.getMany();
        return tasks;
    }

    async findTaskById(id: string): Promise<Task> {
        const found = await this.taskRepository.findOne(id);
        if(!found) {
            throw new NotFoundException(`Task with id ${id} not found.`);
        }
        return found;
    }


    async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
        const task = this.taskRepository.create({
            title: createTaskDto.title,
            description: createTaskDto.description,
            status: TaskStatus.OPEN,
            user: user
        });
        await this.taskRepository.save(task);
        return task;
    }

    async deleteTask(id: string): Promise<void> {
        const result = await this.taskRepository.delete(id);
        if(result.affected === 0) {
            throw new NotFoundException(`Task with id ${id} not found.`)
        }
    }

    async updateTask(id: string, status: UpdateTaskDTO): Promise<Task> {
        const task = await this.findTaskById(id);
        task.status = status.status;
        await this.taskRepository.save(task);
        return task;
    }
}