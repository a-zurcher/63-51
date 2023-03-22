# Cours 1 - 14.03.2003 - Lab GraphQL exo2
###### tags: `HEG` `Technologies émergentes` 

[TOC]

### 1. Repartir depuis le projet "exo 1"

### 2. Ajouter un type « SendProductsInput ». Créer un fichier product.type.ts (2’)

```typescript
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
	 is called in your VaildationPipe.
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
```

### 3. Ce nouveau fichier requiert deux nouveaux packages (1’)

```bash
npm install class-validator
npm install class-transformer
```

### 4. Ajouter le fichier labels.validator.ts (2’)

```typescript
import { Injectable } from '@nestjs/common'
import type {
	ValidatorConstraintInterface,
	ValidationArguments,
	ValidationOptions,
} from 'class-validator'
import { registerDecorator } from 'class-validator'
import { ValidatorConstraint } from 'class-validator'


@ValidatorConstraint({ name: 'labelIds', async: false })
@Injectable()
export class IsLabelValidConstraint implements ValidatorConstraintInterface {

	//get entity ID
	async validate(labelIds: number[], args: ValidationArguments) {
    console.table(labelIds)
    console.table(args)
    //try me !
    //return false
		return true
	}

	defaultMessage(args: ValidationArguments) {
		return 'errors: ' + args.constraints[0]
	}
}

export function IsLabelValid(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsLabelValidConstraint,
		})
	}
}
```

### 5. Ajouter la mutation dans App.resolver (2’)

```typescript
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

```

### 6. Tester avec Postman que la mutation fonctionne (réponse "OK") (2’)

### 7. Changer le comportement de la classe "IsLabelValidConstraint". Décommenter "return false" dans la méthode validate (à la place de "return true"). Le résultat est maintenant :

```JSON
{
  "errors": [
    {
      "message": "Bad Request Exception",
      "locations": [
          {
            "line": 2,
            "column": 5
          }
        ],
      "path": [
        "sendProducts"
      ],
      "extensions": {
        "code": "BAD_REQUEST",
        "stacktrace": [
          "BadRequestException: Bad Request Exception",
          "    at ValidationPipe.exceptionFactory (C:\\Projects\\Github\\My Repositories\\HEG technologies émergentes\\cours 1 - 14.03.2023 - Lab GraphQL\\exo2\\nestjs-graphql-heg\\node_modules\\@nestjs\\common\\pipes\\validation.pipe.js:99:20)",
          "    at ValidationPipe.transform (C:\\Projects\\Github\\My Repositories\\HEG technologies émergentes\\cours 1 - 14.03.2023 - Lab GraphQL\\exo2\\nestjs-graphql-heg\\node_modules\\@nestjs\\common\\pipes\\validation.pipe.js:72:30)",
          "    at processTicksAndRejections (node:internal/process/task_queues:96:5)",
          "    at resolveParamValue (C:\\Projects\\Github\\My Repositories\\HEG technologies émergentes\\cours 1 - 14.03.2023 - Lab GraphQL\\exo2\\nestjs-graphql-heg\\node_modules\\@nestjs\\core\\helpers\\external-context-creator.js:136:31)",
          "    at async Promise.all (index 0)",
          "    at pipesFn (C:\\Projects\\Github\\My Repositories\\HEG technologies émergentes\\cours 1 - 14.03.2023 - Lab GraphQL\\exo2\\nestjs-graphql-heg\\node_modules\\@nestjs\\core\\helpers\\external-context-creator.js:138:13)",
          "    at C:\\Projects\\Github\\My Repositories\\HEG technologies émergentes\\cours 1 - 14.03.2023 - Lab GraphQL\\exo2\\nestjs-graphql-heg\\node_modules\\@nestjs\\core\\helpers\\external-context-creator.js:66:17",
          "    at target (C:\\Projects\\Github\\My Repositories\\HEG technologies émergentes\\cours 1 - 14.03.2023 - Lab GraphQL\\exo2\\nestjs-graphql-heg\\node_modules\\@nestjs\\core\\helpers\\external-context-creator.js:74:28)",
          "    at Object.sendProducts (C:\\Projects\\Github\\My Repositories\\HEG technologies émergentes\\cours 1 - 14.03.2023 - Lab GraphQL\\exo2\\nestjs-graphql-heg\\node_modules\\@nestjs\\core\\helpers\\external-proxy.js:9:24)"
        ],
        "originalError": {
          "statusCode": 400,
          "message": [
            "productsWithIngredients.0.errors: undefined"
          ],
          "error": "Bad Request"
        }
      }
    }
  ],
  "data": null
}
```

Cette erreur n'est pas optimale :

- elle n'est pas explicite (quelle est l'erreur exacte ?)
- elle est trop verbeuse
- elle rend compliqué - pour pas dire impossible - au client (software) de déduire une bonne information afin de corriger automatiquement les données dans le but de renvoyer une mutation correcte
- elle rend un statut http 200

## Problématiques à résoudre

### 1. Nous voulons un meilleur message d'erreur

En effet, le client envoyant des données de produits est un logiciel. Le besoin est de parcourir la réponse, afin de corriger les données de manière automatique. Une structure plus propre doit être retournée.

*Par exemple* :

```JSON
{
  "errors": {
    "sendProducts": {
      "errors": [
        {
          "gtin": "0",
          "property": "property",
          "problem": "problem",
          "message": ""
        }
      ],
      "status": 400
    }
  }
}
```

Réponse :

Afin de ne pas afficher le stacktrace, il est possible de donner de préciser la variable environnement `NODE_ENV` la valeur de `production`:

```bash
NODE_ENV=production npm run start:prod
```

Afin de le désactiver pour les développeurs également, l'autre solution est de modifier le fichier `app.module.ts` et d'ajouter le paramètre `includeStacktraceInErrorResponses: false` à l'importation du module `GraphQLModule` :

```typescript
// ...

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // ici
      includeStacktraceInErrorResponses: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql')
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolver,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ],
})
export class AppModule {}
```

Afin d'aller plus loin dans la personnalisation des messages d'erreurs, on peut créer un [`ExceptionFilter`](https://docs.nestjs.com/exception-filters). Il y a cependant certaines différences avec l'implémentation GraphQL de cette fonctionnalité, comme expliqué dans la section ["other features"](https://docs.nestjs.com/graphql/other-features#exception-filters) de la documentation NestJS.

La [documentation d'Apollo](https://www.apollographql.com/docs/apollo-server/data/errors/) (utilisée par NestJS pour son implémentation GraphQL) explique comment créer une erreur GraphQL.

Pour cela, il faut déclarer le nouveau `ExceptionFilter` dans un nouveau fichier finissant par `.filter.ts`, nous l'avons fait dans `http-exception.filter.ts` :

```typescript
import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

// ne reprendra que des exceptions HTTP
@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);

    // l'erreur personnalisée est gérée ici
    throw new GraphQLError(
      'Custom message',
      {
        extensions: {
          gtin: 0,
          status: HttpStatus.BAD_REQUEST,
          property: 'property',
          problem: 'problem',
          http: {
            status: HttpStatus.BAD_REQUEST
          }
        },
      }
    );
  }
}
```

Il faut ensuite enregistrer ce filtre au niveau de l'application dans `app.module.ts` comme suit, afin que l'application puisse l'utiliser pour filtrer les exceptions :

```typescript
// import ...

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql')
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolver,
    // ici :
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ],
})
export class AppModule {}
```

Malheureusement, notre manière de faire ne reprends pas exactement le format demandé, mais retourne bien une erreur au format GraphQL.

### 2. Le serveur GraphQL doit retourner un statut HTTP correspondant au problème

Si le statut est 400 ("bad request"), alors nous voulons une réponse transmise par le serveur avec un statut HTTP 400, et non un statut HTTP 200.

Nous l'avons déjà implémentée en répondant à la dernière question, voir fichier `http-exception.filter.ts`

```typescript
// l'erreur personnalisée est gérée ici
throw new GraphQLError(
  'Custom message',
  {
    extensions: {
      gtin: 0,
      status: HttpStatus.BAD_REQUEST,
      property: 'property',
      problem: 'problem',
      // section permettant de retourner un
      // statut HTTP correspondant à l'erreur
      http: {
        status: HttpStatus.BAD_REQUEST
      }
    },
  }
);
```