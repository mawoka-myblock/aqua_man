/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */


import type {RequestHandler} from "@sveltejs/kit";
import {validate_json} from "$lib/utils/validate_json";
import {CreateUser} from "$lib/schemas";
import type {Infer} from "@badrap/valita";
import {prisma, Prisma} from "$lib/utils/clients";
import {hash} from "argon2";


type CreateUserType = Infer<typeof CreateUser>

export const POST: RequestHandler = async ({request}) => {
    const res = await validate_json(request, CreateUser)
    if (!res[1]) {
        return res[0]
    }
    const data: CreateUserType = res[0]
    try {
        data.password = await hash(data.password)
    } catch (e) {
        return {
            status: 500,
            body: {
                detail: "error"
            }
        }
    }

    try {
        const res = await prisma.user.create({
            data: {
                email: data.email,
                password: data.password
            },
            select: {
                email: true
            }

        })
        return {
            status: 201,
            body: res
        }
    } catch (e) {
         if (e instanceof Prisma.PrismaClientKnownRequestError) {
             if (e.code === "P2002") {
                 return {
                     status: 400,
                     body: {
                         detail: "Something went wrong"
                     }
                 }
             }
         }
    }
}