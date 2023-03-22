import { UsePipes, ValidationPipe } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { SendProductsInput } from "./product.type";

@Resolver()
export class AppResolver {

  @Query((returns) => String)
  sayMessage(@Args('message') message: string) {
    return `The message is: ${message}`;
  }

 @UsePipes(new ValidationPipe())
  @Mutation(() => String)
  async sendProducts(
    @Args('input', { type: () => SendProductsInput })
    input: SendProductsInput
  ): Promise<string> {
    console.table(input.productsWithIngredients)
    
    return "OK"
  }
}