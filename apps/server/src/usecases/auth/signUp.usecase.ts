import bcrypt from "bcryptjs";
import { prismaClient } from "../../lib/prisma/client";

type Payload = {
  name: string;
  email: string;
  password: string;
};

export class SignUpEmailDuplicateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SignUpEmailDuplicateError";
  }
}

export const authSignUpUsecase = async ({ name, email, password }: Payload) => {
  const existingUser = await prismaClient.user.findUnique({ where: { email } });

  console.log("existingUser", existingUser);

  if (existingUser) {
    throw new SignUpEmailDuplicateError(
      "このメールアドレスは既に登録されています。",
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  console.log("hashedPassword", hashedPassword);

  const user = await prismaClient.user
    .create({
      data: {
        email,
        name,
        hashedPassword,
        image: "",
        emailVerified: new Date(),
      },
    })
    .catch((e) => {
      console.log("e", e);
    });

  return {
    user,
  };
};
