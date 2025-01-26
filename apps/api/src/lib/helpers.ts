import { SafeParseError } from "zod";

export const handleValidationError = (error: SafeParseError<any>) => {
  return {
    error: error.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  };
};
