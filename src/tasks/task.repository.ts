import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDTO } from "./DTO/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateTaskDTO } from "./DTO/update-task.dto";
import { GetTasksFilterDTO } from "./DTO/get-tasks-filter.dto";
import { filter } from "rxjs";
import { User } from "src/auth/user.entity";

@Injectable()
export class TasksRepository {

    private logger = new Logger('TasksRepository');
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ) { }

    async getTasks(filterDto: GetTasksFilterDTO, user: User): Promise<Task[]> {
        const query = this.taskRepository.createQueryBuilder('task');

        const { status, search } = filterDto;

        query.where({ user });
        if (status) {
            query.andWhere('task.statussss = :status', { status })
        }

        if (search) {
            query.andWhere(
                '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
                { search: `%${search}%` }
            );
        }
        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`Failed to get tasks for user ${user.username}`, error.stack)
            throw new InternalServerErrorException();
        }

    }

    async findTaskById(id: string, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, user } })
        if (!found) {
            throw new NotFoundException(`Task for ID ${id} does not exist`);
        }

        console.log('passed the id, user check');

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

    async deleteTask(id: string, user: User): Promise<void> {
        const result = await this.taskRepository.delete({ id, user });
        if (result.affected === 0) {
            throw new NotFoundException(`Task with id ${id} not found.`)
        }
    }

    async updateTask(id: string, status: UpdateTaskDTO, user: User): Promise<Task> {
        const task = await this.findTaskById(id, user);
        task.status = status.status;
        await this.taskRepository.save(task);
        return task;
    }
}