import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';
import { AuthorModule } from './modules/author/author.module';
import { PostModule } from './modules/post/post.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/lib/graphql/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault],
    }),
    AuthorModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
