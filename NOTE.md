# User-Log Project

**Node Version:** `v22.14.0`
**npm Version:** `10.9.2`  
**VueJS Version:** `^3.2.13`  
**Mongoose Version:** `^8.12.1`  
**NestJS Version:** `^11.0.1`
This project consists of a NestJS API (in the `api` folder) and a Vue 3 frontend (located in the root). Follow the instructions below to set up, build, run, seed, and deploy the project.

---

## 1. Project Structure
```
user-log/
├── api/                     # NestJS backend
│   ├── src/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── entry-log/
│   │   ├── user/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── ...              # Other modules, controllers, services, etc.
│   ├── dist/                # Compiled output after building the API
│   ├── node_modules/
│   ├── .env
│   ├── .env.example
│   ├── nest-cli.json
│   ├── package.json
│   ├── tsconfig.build.json
│   ├── tsconfig.json
│   └── README.md
├── node_modules/
├── public/                  # Contains built frontend assets
│   └── dist/                # Vue build output
├── src/                     # Vue source code
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── views/
│   ├── App.vue
│   ├── main.js
│   └── router/index.js
├── .gitignore
├── babel.config.js
├── package-lock.json
├── package.json             # Main package.json for the entire project
├── note.txt                 # Notes about the project
├── README.md                # Project documentation
└── vue.config.js

```
---

## 2. Installation

### 2.1. Install Frontend (Vue 3) Dependencies

From the project root, run:

```bash
npm install

```

### 2.2. Install NestJs Dependencies

From the project root, run:

```bash
cd api
npm install

```
## 3. Run Development 

From the project root, run:

```bash
npm run serve
```

## 4. Run Production 

From the project root, run:

```bash
npm run start:prod
```

## 5. Add Super Admin

From the project root, run:

```bash
cd api
npx ts-node -r tsconfig-paths/register src/seeds/seed-users.ts
```

