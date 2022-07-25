/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type {RequestHandler} from "@sveltejs/kit";
import {prisma} from "$lib/utils/clients";

export const GET: RequestHandler = async ({params, locals}) => {
    if (!locals.id) {
        return {
            status: 401
        }
    }
    const id = parseInt(params.id)
    if (isNaN(id)) {
        return {
            status: 400,
            body: {
                detail: "id isn't a number"
            }
        }
    }
    const db_res = await prisma.wassertests.findUnique({
        where: {
            id,
            user_id: locals.id
        }
    })
    if (db_res) {
        return {
            status: 200,
            body: db_res
        }
    } else {
        return {
            status: 404
        }
    }

}