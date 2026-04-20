import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  prisma = new Proxy({} as PrismaClient, {
    get() {
      throw new Error("DATABASE_URL is not set. Configure it in the environment.");
    },
  });
} else if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;

declare global {
  var prisma: PrismaClient | undefined;
}
