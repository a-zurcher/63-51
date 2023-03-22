# Cours 1 - 14.03.2003 - Lab GraphQL exo1
###### tags: `HEG` `Technologies émergentes` 

[TOC]

Lab GraphQL - Exercice 1 : création du projet et première query
===============================================================

cd "C:\Projects\Github\My Repositories\HEG technologies émergentes\cours 1 - 14.03.2023 - Lab GraphQL Live demo"

### 1. CLI

`npm i -g @nestjs/cli`

### 2. Create project

`nest new nestjs-graphql-heg-exo1`

### 3. Install GraphQL packages

`npm i @nestjs/graphql @nestjs/apollo @apollo/server graphql`

### 4. ADD GraphQL module imports in app.module.ts

```typescript
import { AppResolver } from './app.resolver';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql')
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

ESLINT: 

`'prettier/prettier': 'off',`

### 5. Create app resolver

```typescript
import { Args, Query, Resolver } from "@nestjs/graphql";

@Resolver()
export class AppResolver {

  @Query((returns) => String)
  sayMessage(@Args('message') message: string) {
    return `The message is: ${message}`;
  }
}
```


### 6. Add AppResolver to app.module providers

```typescript
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql')
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
```

### 7. Start the server
```bash
npm run start:dev
```

### 8. Browse the playground

http://localhost:3000/graphql

Write your query... not easy !

### 9. Copy the schema to GraphQL Query Generator (chrome extension)

Click on the right: schema. Copy the whole schema.
Paste in GraphQL Query Generator, start.

### 10. Copy the query, input variables in Playground.

### 11. Do the same test using Postman