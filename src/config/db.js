// This creates a connection to the database using Prisma.
// You'll use this anytime you need to talk to the DB (read, write, update, etc.)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
