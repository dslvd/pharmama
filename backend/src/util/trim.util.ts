import { TransformFnParams } from "class-transformer";

// only trims strings, so a wrong type gets a 400 from the validator instead of crashing
export const trim = ({ value }: TransformFnParams) =>
  typeof value === "string" ? value.trim() : value;
