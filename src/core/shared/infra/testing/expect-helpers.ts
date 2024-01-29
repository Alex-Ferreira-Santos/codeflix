import { coloredText } from "../../../utils/console-colors";
import { Notification } from "../../domain/validators/notification";


expect.extend({
  notificationContainsErrorMessages(
    expected: Notification,
    recieved: Array<string | Record<string, string[]>>
  ) {
    const every = recieved.every((error) => {
      if (typeof error === "string") return expected.errors.has(error);
      return Object.entries(error).every(([field, messages]) => {
        const fieldMessages = expected.errors.get(field) as string[];

        return (
          fieldMessages &&
          fieldMessages.length &&
          fieldMessages.every((message) => message.includes(message))
        );
      });
    });

    return every
      ? { pass: true, message: () => "" }
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
  },
});