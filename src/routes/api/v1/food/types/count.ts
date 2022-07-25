/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type {RequestHandler} from "@sveltejs/kit";
import {prisma} from "$lib/utils/clients";

export const GET: RequestHandler = async ({locals}) => {
    if (!locals.id) {
        return {
            status: 401
        }
    }
    const res = await prisma.fressenTypen.count({
        where: {
            user_id: locals.id
        }
    })

    return {
        status: 200,
        body: {count: res}
    }

}