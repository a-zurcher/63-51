import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);

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