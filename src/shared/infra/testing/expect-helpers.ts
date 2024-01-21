import { coloredText } from "../../../utils/console-colors";
import { ClassValidatorFields } from "../../domain/validators/class-validator-fields";
import { EntityValidationError } from "../../domain/validators/validation.error";
import { FieldsErrors } from "../../domain/validators/validator-fields-interface";

type TExpected =
  | {
      validator: ClassValidatorFields<any>;
      data: any;
    }
  | (() => any);

expect.extend({
  containsErrorMessages(expected: TExpected, recieved: FieldsErrors) {
    if (typeof expected === "function") {
      try {
        expected();
        return isValid();
      } catch (err) {
        const error = err as EntityValidationError;
        return assertContainsErrorMessage(error.errors, recieved);
      }
    }

    const { data, validator } = expected;
    const validated = validator.validate(data);

    if (validated) return isValid();
    return assertContainsErrorMessage(validator.errors, recieved);
  },
});

function assertContainsErrorMessage(
  expected: FieldsErrors,
  recieved: FieldsErrors
) {
  const isMatch = expect.objectContaining(recieved).asymmetricMatch(expected);

  return isMatch
    ? isValid()
    : {
        pass: false,
        message: () =>
          `${"=".repeat(
            90
          )}\n\nThe validation errors doesn't contains:\n\n${coloredText({
            color: "green",
            text: JSON.stringify(recieved),
          })}\n\nCurrent:\n\n${coloredText({
            color: "purple",
            text: JSON.stringify(expected),
          })}\n\n${"=".repeat(90)}`,
      };
}

function isValid() {
  return { pass: true, message: () => "" };
}
