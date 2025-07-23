import { baseUserSchema } from "./baseUser.schema";
import { UserModel } from "../../models/user.model";
import { uniqueValidator } from "../utils/uniqueValidator";

export const userSchema = baseUserSchema.superRefine(
  async (data, ctx) => {
    await uniqueValidator(UserModel, 'username', 'Username already exists')(data, ctx);
  }
);
