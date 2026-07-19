import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type RequestSource = "body" | "params" | "query";

function validationFailed(res: Response, errors: { field: string; message: string }[]) {
  res.status(400).json({
    success: false,
    message: "Validation failed",
    errors,
  });
}

const parseRequestSource =
  (schema: ZodSchema, source: RequestSource) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      validationFailed(
        res,
        result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      );

      return;
    }

    if (source === "query") {
      res.locals.validatedQuery = result.data;
      next();
      return;
    }

    req[source] = result.data;

    next();
  };

export const validate =
  (schema: ZodSchema) =>
    parseRequestSource(schema, "body");

export const validateParams = (schema: ZodSchema) =>
  parseRequestSource(schema, "params");

export const validateQuery = (schema: ZodSchema) =>
  parseRequestSource(schema, "query");
