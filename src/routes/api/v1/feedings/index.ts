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


const FeedingPost = v.object({
    time: v.string().chain(validateDate).optional(),
    food: v.number()
})
type FeedingPostType = v.Infer<typeof FeedingPost>

export const POST: RequestHandler = async ({request}) => {
    const res = await validate_json(request, FeedingPost)
    if (!res[1]) {
        return res[0]
    }
    const data: FeedingPostType = res[0]

    const db_res = await prisma.fuetterungen.create({
        data: {
            futter_id: data.food,
            zeit: data.time === undefined ? undefined : data.time.toJSDate()
        }
    })
    return {
        status: 201,
        body: db_res
    }

}


export const GET: RequestHandler = async ({url}) => {
    let limit = 10
    let offset = 0
    let futter_typen = [-1]
    const url_params = {
        limit: url.searchParams.get("limit"),
        offset: url.searchParams.get("offset"),
        feedings: url.searchParams.get("feedings"),
    }
    if (url_params.limit) {
        limit = parseInt(url_params.limit)
        if (isNaN(limit)) {
            return {status: 400, body: {detail: "limit isn't a number"}}
        }
    }
    if (url_params.feedings) {
        futter_typen = url_params.feedings.split(",").map(Number)
        for (const val of futter_typen) {
            if (isNaN(val)) {
                return {
                    status: 400,
                    body: {
                        detail: "A feeding-id wasn't a number"
                    }
                }
            }
        }
        if (futter_typen.length === 0) {
            futter_typen = [-1]
        }
    }
    if (url_params.offset) {
        offset = parseInt(url_params.offset)
        if (isNaN(offset)) {
            return {status: 400, body: {detail: "offset isn't a number"}}
        }
    }


    const res = await prisma.fuetterungen.findMany({
        skip: offset,
        take: limit,
        where: {
            futter_id: futter_typen[0] === -1 ? undefined : {
                in: futter_typen
            }
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