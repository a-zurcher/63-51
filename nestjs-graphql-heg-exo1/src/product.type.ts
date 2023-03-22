import {
	Field,
	InputType,
	Int,
	registerEnumType,
} from '@nestjs/graphql'
import { Max, Min, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { IsLabelValid } from './labels.validator'

@InputType()
export class SendProductsInput {
	/*
	 For a nested type to be validated, it needs to be an instance
     of a class not just a plain data object.
	 With the @Type decorator you tell class-transformer
	 to instantiate a class for the given property when plainToClass
	 is called in your ValidationPipe.
	 */
	@ValidateNested({ each: true })
	@Type(() => ProductInput)
	@Field(() => [ProductInput])
	productsWithIngredients: ProductInput[]
}

@InputType()
export class ProductInput {
  @Field(() => String)
	name: string
	@Field(() => Int)
	brandId: number
	@Field(() => String, { nullable: true })
	gtin: string
	@Field(() => String, { nullable: true }) articleNumber: string
	@IsLabelValid()
	@Field(() => [Int], { nullable: true })
	labelIds: Array<number>
	@Field(() => Boolean) isFrozen: boolean
	@Field(() => [AllergenInput], { nullable: true })
	allergens: AllergenInput[]
	@Field(() => [IngredientInput], { nullable: true })
	ingredients?: IngredientInput[]
}

@InputType()
export class IngredientInput {
	@Field(() => String)
	name: string
	@Field()
	@Min(0)
	@Max(1)
	percentage?: number
}

@InputType()
export class AllergenInput {
	@Field(() => Int) allergenId!: number
	@Field(() => EnumAllergenType) allergenType: EnumAllergenType
}

export enum EnumAllergenType {
	UNDECLARED = 'undeclared',
	MAY_CONTAINS = 'mayContains',
	CONTAINS = 'contains',
	FREE_FROM = 'freeFrom',
}

registerEnumType(EnumAllergenType, { name: 'EnumAllergenType' })
