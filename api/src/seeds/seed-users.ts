import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';
import { Gender, Role } from 'src/user/user.enums';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const userService = appContext.get(UserService);

  const users = [
    {
      fullName: 'Super Admin',
      username: 'super_admin',
      email: 'super_admin@yopmail.com',
      password: '123123',
      employeeID: 'super_admin',
      role: Role.SUPER_ADMIN,
      position: 'Developer',
      gender: Gender.MALE,
      birthday: new Date('1990-01-01'),
      phone: '123456789',
      address: '123 Main Street',
      avatar: '',
    }
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
