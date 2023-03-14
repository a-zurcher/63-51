import { Args, Query, Resolver } from "@nestjs/graphql";

@Resolver()
export class AppResolver {

  @Query((returns) => String)
  sayMessage(@Args('message') message: string) {
    return `The message is: ${message}`;
  }
}