/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// import * as PrismaDev from '@prisma/client';

// This works in PROD
// import Prisma from '@prisma/client';

// let { PrismaClient } = PrismaDev;
// console.log(PrismaDev)
/*if (!import.meta.env.DEV) PrismaClient = Prisma.PrismaClient;

export const prisma = new PrismaClient();*/

/*import Prisma, * as PrismaScope from "@prisma/client";
const PrismaClient = Prisma?.PrismaClient || PrismaScope?.PrismaClient;
export const prisma = new PrismaClient();*/


/*
import Prisma, * as PrismaAll from "@prisma/client";

export const prisma = Prisma?.PrismaClient || PrismaAll?.PrismaClient;*/
/*

import pkg, { PrismaClient } from '@prisma/client';
import { dev } from '$app/env';

declare global {
	var _prisma: PrismaClient; // eslint-disable-line
}

let prisma_2;
if (dev) {
	if (!global._prisma) {
		global._prisma = new PrismaClient();
	}
	prisma_2 = global._prisma;
} else {
	const { PrismaClient } = pkg;
	prisma_2 = new PrismaClient();
}

export const prisma = prisma_2 as PrismaClient
*/

import * as Prisma_ from '@prisma/client';

// This works in PROD
import { default as ProdPrisma } from '@prisma/client';

let { PrismaClient } = Prisma_;
if (!import.meta.env.DEV) PrismaClient = ProdPrisma.PrismaClient;

export const prisma = new PrismaClient();
export const Prisma = Prisma_.Prisma
