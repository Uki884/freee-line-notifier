import { prismaClient } from "../../lib/prisma/client";

export const exampleIndexUsecase = async () => {
  const result = await prismaClient.user.findMany();

  return result;
};
