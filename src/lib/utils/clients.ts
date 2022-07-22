/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as PrismaDev from '@prisma/client';

// This works in PROD
// import Prisma from '@prisma/client';

const { PrismaClient } = PrismaDev;
// console.log(PrismaDev)
// if (!import.meta.env.DEV) PrismaClient = Prisma.PrismaClient;

export const prisma = new PrismaClient();

/*import Prisma, * as PrismaScope from "@prisma/client";
const PrismaClient = Prisma?.PrismaClient || PrismaScope?.PrismaClient;
export const prisma = new PrismaClient();*/


/*
import Prisma, * as PrismaAll from "@prisma/client";

export const prisma = Prisma?.PrismaClient || PrismaAll?.PrismaClient;*/
