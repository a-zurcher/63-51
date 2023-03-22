import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
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
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
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
