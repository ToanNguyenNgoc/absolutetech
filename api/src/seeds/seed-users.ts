import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';
import { Gender, Role } from 'src/user/user.enums';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const userService = appContext.get(UserService);

  const users = [
    {
      fullName: 'Alice Johnson',
      username: 'admin_user_log_1',
      email: 'admin_user_log_1@example.com',
      password: 'password123',
      employeeID: 'admin_user_log_1',
      role: Role.ADMINISTRATOR,
      position: 'Developer',
      gender: Gender.MALE,
      birthday: new Date('1990-01-01'),
      phone: '123456789',
      address: '123 Main Street',
      avatar: '',
    },
    {
      fullName: 'Bob Smith',
      username: 'admin_user_log_2',
      email: 'bob@example.com',
      password: 'password123',
      employeeID: 'admin_user_log_2',
      role: Role.ADMINISTRATOR,
      position: 'Designer',
      gender: Gender.MALE,
      birthday: new Date('1991-02-02'),
      phone: '987654321',
      address: '456 Another Ave',
      avatar: '',
    },
  ];

  for (const user of users) {
    try {
      const created = await userService.createUser(user);
      console.log(`Created user: ${created.username}`);
    } catch (error) {
      console.error('Error creating user:', error.message);
    }
  }

  await appContext.close();
}

bootstrap();
// npx ts-node -r tsconfig-paths/register src/seeds/seed-users.ts
