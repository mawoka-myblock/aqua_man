/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */



import type {RequestHandler} from "@sveltejs/kit";
import {validate_json} from "$lib/utils/validate_json";
import * as v from "@badrap/valita";


export const POST: RequestHandler = async ({request}) => {
    const res = await validate_json(request, PostTestType)
    if (!res[1]) {
        return res[0]
    }
    const data: PostTestTypeType = res[0]
}