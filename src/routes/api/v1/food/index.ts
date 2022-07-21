/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type {RequestHandler} from "@sveltejs/kit";
import {validate_json} from "$lib/utils/validate_json";
import {prisma} from "$lib/utils/clients";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";
import * as v from "@badrap/valita";
import {validateDate} from "$lib/utils/helpers";


const PostFood = v.object({
    type_id: v.number(),
    mhd: v.string().chain(validateDate).optional(),
    producer: v.string(),
    buying_date: v.string().chain(validateDate).optional(),
    amount: v.number().optional(),
    name: v.string().optional()

})
type PostFoodType = v.Infer<typeof PostFood>

export const POST: RequestHandler = async ({request}) => {
    const res = await validate_json(request, PostFood)
    if (!res[1]) {
        return res[0]
    }
    const data: PostFoodType = res[0]
    try {
        const res = await prisma.fressen.create({
            data: {
                type_id: data.type_id,
                mhd: data.mhd === undefined ? undefined : data.mhd.toJSDate(),
                hersteller: data.producer,
                kauf_datum: data.buying_date === undefined ? undefined : data.buying_date.toJSDate(),
                menge: data.amount,
                name: data.name
            }
        })
        return {
            status: 201,
            body: res
        }
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            return {
                status: 500,
                body: {
                    detail: e.message
                }
            }
        } else {
            throw e
        }
    }
}


export const GET: RequestHandler = async ({url}) => {
    const include_empty = Boolean(url.searchParams.get("include_empty"))
    const offset = parseInt(url.searchParams.get("offset") ?? "0")
    const limit = parseInt(url.searchParams.get("limit") ?? "30")


    const res = await prisma.fressen.findMany({
        take: limit,
        skip: offset,
        where: {
            leer: include_empty ? undefined : false
        },
        include: {
            fressen_typen: true
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