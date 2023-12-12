import { ZodError } from "zod";

export function formatZodError(error: ZodError): string {
  let errorMessage = "Validation failed for the following reasons:\n";

  for (const issue of error.issues) {
    errorMessage += `Path: ${issue.path.join(".")}, Message: ${
      issue.message
    }\n`;
  }

  return errorMessage;
}
