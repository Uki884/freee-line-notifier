import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { authSignUpUsecase } from "../../usecases/auth/signUp.usecase";
import { SignUpEmailDuplicateError } from "../../usecases/auth/signUp.usecase";

export const signUpRoute = new Hono().post(
  "",
  zValidator(
    "json",
    z.object({
      name: z
        .string()
        .max(255, "名前は255文字以内で入力してください。")
        .min(1, "名前は1文字以上で入力してください。"),
      email: z
        .string()
        .regex(
          /^(?=.{1,128}$)[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]$/,
          "メールアドレスを正しく入力して下さい",
        )
        .min(1, "メールアドレスが入力されていません"),
      password: z
        .string()
        .max(72, "パスワードは72文字以内で入力してください。")
        .min(8, "パスワードは8文字以上で入力してください。")
        .regex(
          /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/,
          "パスワードは半角英数記号で入力してください。",
        )
        .min(1, "パスワードを入力してください。"),
    }),
  ),
  async (c) => {
    const { name, email, password } = c.req.valid("json");

    try {
      const user = await authSignUpUsecase({ name, email, password });

      return c.json(
        {
          result: user,
        },
        200,
      );
    } catch (e) {
      if (e instanceof SignUpEmailDuplicateError) {
        return c.json(
          {
            result: e.message,
          },
          422,
        );
      }
      return c.json(
        {
          result: "Internal Server Error",
        },
        500,
      );
    }
  },
);
