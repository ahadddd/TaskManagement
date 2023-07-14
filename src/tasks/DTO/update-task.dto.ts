import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../tasks.model';
export class UpdateTaskDTO{
    @IsEnum(TaskStatus)
    status: TaskStatus;
}