/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Prisma_ from '@prisma/client';

// This works in PROD
import { default as ProdPrisma } from '@prisma/client';

let { PrismaClient } = Prisma_;
if (!import.meta.env.DEV) PrismaClient = ProdPrisma.PrismaClient;

export const prisma = new PrismaClient();
export const Prisma = Prisma_.Prisma;
