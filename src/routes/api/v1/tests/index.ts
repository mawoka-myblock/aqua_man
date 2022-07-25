/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type {RequestHandler} from "@sveltejs/kit";
import {validate_json} from "$lib/utils/validate_json";
import {prisma} from "$lib/utils/clients";
import {validateDate, possible_test_types} from "$lib/utils/helpers";
import * as v from "@badrap/valita";


const PostTestType = v.object({
    time: v.string().chain(validateDate).optional(),
    value: v.number(),
    unit: v.string().optional(),
    type: possible_test_types
})
type PostTestTypeType = v.Infer<typeof PostTestType>

export const POST: RequestHandler = async ({request, locals}) => {
    if (!locals.id) {
        return {
            status: 401
        }
    }
    const res = await validate_json(request, PostTestType)
    if (!res[1]) {
        return res[0]
    }
    const data: PostTestTypeType = res[0]

    const db_res = await prisma.wassertests.create({
        data: {
            user_id: locals.id,
            einheit: data.unit,
            wert: data.value,
            zeit: data.time === undefined ? undefined : data.time.toJSDate(),
            type: data.type
        }
    })
    return {
        status: 201,
        body: db_res
    }

}


export const GET: RequestHandler = async ({url, locals}) => {
    if (!locals.id) {
        return {
            status: 401
        }
    }
    let limit = 10
    let offset = 0
    let test_types = ["*"]
    const url_params = {
        limit: url.searchParams.get("limit"),
        offset: url.searchParams.get("offset"),
        types: url.searchParams.get("types"),
    }
    if (url_params.limit) {
        limit = parseInt(url_params.limit)
        if (isNaN(limit)) {
            return {status: 400, body: {detail: "limit isn't a number"}}
        }
    }
    if (url_params.offset) {
        offset = parseInt(url_params.offset)
        if (isNaN(offset)) {
            return {status: 400, body: {detail: "offset isn't a number"}}
        }
    }
    if (url_params.types) {
        test_types = url_params.types.split(",")
        for (const val of test_types) {
            try {
                possible_test_types.parse(val)
            } catch (err) {
                if (!(err instanceof v.ValitaError)) throw err
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const errors: any = err.issues
                return {
                    status: 400,
                    body: {
                        detail: errors
                    }
                }
            }

        }
        if (test_types.length === 0) {
            test_types = ["*"]
        }
    }

    const res = await prisma.wassertests.findMany({
        skip: offset,
        take: limit,
        where: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore TS2322
            type: test_types[0] === "*" ? undefined : {
                in: test_types
            },
            user_id: locals.id
        }
    })
    if (res) {
        return {
            status: 200,
            body: res
        }
    } else {
        return {
            status: 404
        }
    }
}