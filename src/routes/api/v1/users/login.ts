/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type {RequestHandler} from "@sveltejs/kit";
import {CreateUser} from "$lib/schemas";
import type {Infer} from "@badrap/valita";
import {validate_json} from "$lib/utils/validate_json";
import {prisma} from "$lib/utils/clients";
import {verify} from "argon2";
import {serialize as CookieSerialize} from "cookie"
import {sign as jwt_sign} from "jsonwebtoken"

type CreateUserType = Infer<typeof CreateUser>

export const POST: RequestHandler = async ({request, locals}) => {
    if (locals.email) {
        return {
            status: 200,
            body: {
                email: locals.email
            }
        }
    }
    const res = await validate_json(request, CreateUser)


    if (!res[1]) {
        return res[0]
    }
    const data: CreateUserType = res[0]

    const user = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })
    if (!user) {
        return {
            status: 401,
            body: {
                detail: "Email or password wrong"
            }
        }
    }

    try {
        if (!await verify(user.password, data.password)) {
            return {
                status: 401,
                body: {
                    detail: "Email or password wrong"
                }
            }
        }
    } catch (e) {
        console.error(e)
        return {
            status: 401,
            body: {
                detail: "Email or password wrong"
            }
        }
    }
    const generated_remember_token = [...Array(50)].map(() => Math.random().toString(36)[2]).join('')

    const key = process.env.SECRET_KEY
    if (!key) {
        throw "SECRET_KEY is invalid"
    }
    const jwt = jwt_sign({"id": user.id, "email": user.email}, key, {expiresIn: "1h"})
    const jwt_cookie = CookieSerialize("jwt", jwt, {httpOnly: true, path: "/", maxAge: 3600})


    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            remember_keys: {
                push: generated_remember_token
            }
        }
    })
    const remember_cookie = CookieSerialize("rememberme", generated_remember_token, {
        httpOnly: true,
        path: "/"
    })
    return {
        status: 200,
        headers: {
            "Set-Cookie": [remember_cookie, jwt_cookie]
        },
        body: {
            email: user.email
        }
    }

}