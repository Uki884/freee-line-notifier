import { PrismaClient } from "../output";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// biome-ignore lint:
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
