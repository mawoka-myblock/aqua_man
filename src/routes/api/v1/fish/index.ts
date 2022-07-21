/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type {RequestHandler} from "@sveltejs/kit";
import * as v from "@badrap/valita";
import {prisma} from "$lib/utils/clients";
import {validate_json} from "$lib/utils/validate_json";
import {validateDate} from "$lib/utils/helpers";


const PostFish = v.object({
    name: v.string().optional(),
    birthday: v.string().chain(validateDate).optional(),
    death: v.string().chain(validateDate).optional(),
    lat_name: v.string(),
    food: v.array(v.number())
})
type PostFishType = v.Infer<typeof PostFish>

export const POST: RequestHandler = async ({request}) => {
    const res = await validate_json(request, PostFish)
    if (!res[1]) {
        return res[0]
    }
    const data: PostFishType = res[0]

    const fische_fressen_ids = []
    for (const el of data.food) {
        fische_fressen_ids.push({fische_id_fressen_typen_id: el})
    }

    const get_object_for_prisma = (index: number): object => {
        return {fressen_typen_id: data.food[index]}
    }

    console.log(Array.from(new Array(data.food.length), (val, index) => get_object_for_prisma(index)))
    const db_res = await prisma.fische.create({
        data: {
            name: data.name,
            lat_name: data.lat_name,
            tod: data.death === undefined ? undefined : data.death.toJSDate(),
            geburtsdatum: data.birthday === undefined ? undefined : data.birthday.toJSDate(),
            fische_fressen: {
                createMany: {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore TS2322
                    data: Array.from(new Array(data.food.length), (val, index) => get_object_for_prisma(index))
                }
            }
        },
        include: {
            fische_fressen: {
                include: {
                    fressen_typen: true
                }
            }
        },

    })
    return {
        status: 201,
        body: db_res
    }
}

export const GET: RequestHandler = async ({url}) => {
    const url_query = url.searchParams.get("q")
    const offset = parseInt(url.searchParams.get("offset") ?? "0")
    const limit = parseInt(url.searchParams.get("limit") ?? "30")
    if (isNaN(limit)) {
        return {status: 400, body: {detail: "limit isn't a number"}}
    }
    if (isNaN(offset)) {
        return {status: 400, body: {detail: "offset isn't a number"}}
    }


    if (url_query) {
        const res = await prisma.fische.findMany({
            take: limit,
            skip: offset,
            where: {
                name: {
                    search: url_query
                },
                lat_name: {
                    search: url_query
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
    } else {
        const res = await prisma.fische.findMany({
            take: limit,
            skip: offset
        })

        return {
            status: 200,
            body: res
        }
    }


}