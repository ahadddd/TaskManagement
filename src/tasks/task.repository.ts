import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDTO } from "./DTO/create-task.dto";
import { TaskStatus } from "./task-status.enum";

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
    async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
        const task = this.create({
            title: createTaskDto.title,
            description: createTaskDto.description,
            status: TaskStatus.OPEN
        });

        await this.save(task);
        return task;
    }
}