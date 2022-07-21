import * as Prisma from '@prisma/client';

// This works in PROD
import { default as ProdPrisma } from '@prisma/client';
import Ajv from "ajv";

let { PrismaClient } = Prisma;
if (!import.meta.env.DEV) PrismaClient = ProdPrisma.PrismaClient;

export const prisma = new PrismaClient();
export const ajv = new Ajv()