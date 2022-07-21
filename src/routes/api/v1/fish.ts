import type {RequestHandler} from "@sveltejs/kit";
import * as v from "@badrap/valita";
import {prisma} from "$lib/utils/clients";
import {validate_json} from "$lib/utils/validate_json";
import {DateTime} from "luxon"
import {validateDate} from "$lib/utils/helpers";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";


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
    const raw_id = url.searchParams.get("id")
    if (!raw_id) {
        return {status: 400, body: {detail: "No id provided."}}
    }
    const id = parseInt(raw_id)
    if (isNaN(id)) {
        return {
            status: 400,
            body: {
                detail: "id isn't a number"
            }
        }
    }
    const res = await prisma.fische.findUnique({
        where: {
            id: id
        },
        include: {
            fische_fressen: {
                include: {
                    fressen_typen: true
                }
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