import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksRepository } from './tasks/task.repository';
import { Task } from './tasks/task.entity';

@Module({
  imports: [TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'task-management',
      synchronize: true,
      autoLoadEntities: true
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
