/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type {RequestHandler} from "@sveltejs/kit";
import type {Infer} from "@badrap/valita";
import {prisma, Prisma} from "$lib/utils/clients";
import {validate_json} from "$lib/utils/validate_json";
import {PostFish} from "$lib/schemas";

const PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError


type PostFishType = Infer<typeof PostFish>

export const POST: RequestHandler = async ({request, locals}) => {
    if (!locals.id) {
        return {
            status: 401
        }
    }
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

    try {
        const db_res = await prisma.fische.create({
            data: {
                name: data.name,
                lat_name: data.lat_name,
                tod: data.death === undefined ? undefined : data.death.toJSDate(),
                geburtsdatum: data.birthday === undefined ? undefined : data.birthday.toJSDate(),
                user_id: locals.id,
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
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            if (e.code === "P2003") {
                return {
                    status: 404,
                    body: {
                        detail: "Food-Type wasn't found!"
                    }
                }
            } else {
                throw e
            }
        } else {
            throw e
        }
    }

}


export const GET: RequestHandler = async ({url, locals}) => {
    if (!locals.id) {
        return {
            status: 401
        }
    }
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
                },
                user_id: locals.id
            },

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
            skip: offset,
            where: {
                user_id: locals.id
            },
            select: {
                name: true,
                tod: true,
                lat_name: true,
                geburtsdatum: true,
                id: true,
                fische_fressen: {
                    select: {
                        fressen_typen: true
                    }
                }
            }
        })

        return {
            status: 200,
            body: res
        }
    }


}