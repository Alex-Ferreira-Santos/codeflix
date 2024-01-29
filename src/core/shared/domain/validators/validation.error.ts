import { FieldsErrors } from "./validator-fields-interface";

export class EntityValidationError extends Error {
  constructor(public errors: FieldsErrors[], message = "Entity Validation Error") {
    super(message);
    this.name = "EntityValidationError";
  }

  count() {
    return Object.keys(this.errors).length;
  }
}
