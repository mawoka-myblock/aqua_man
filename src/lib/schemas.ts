/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as v from "@badrap/valita";
import {validateDate} from "./utils/helpers";


export const string_min_len = (s: string): boolean => {
    return s.length !== 0
}

export const PostFood = v.object({
    type_id: v.number(),
    mhd: v.string().chain(validateDate).optional(),
    producer: v.string().assert(string_min_len),
    buying_date: v.string().chain(validateDate).optional(),
    amount: v.number().optional(),
    name: v.string().assert(string_min_len)

})

export const PatchFood = v.object({
    id: v.number(),
    type_id: v.number().optional(),
    mhd: v.string().chain(validateDate).optional(),
    producer: v.string().assert(string_min_len).optional(),
    buying_date: v.string().chain(validateDate).optional(),
    amount: v.number().optional(),
    name: v.string().assert(string_min_len).optional(),
    empty: v.boolean().optional()

})

export const PostFish = v.object({
    name: v.string().assert(string_min_len),
    birthday: v.string().chain(validateDate).optional(),
    death: v.string().chain(validateDate).optional(),
    lat_name: v.string().assert(string_min_len),
    food: v.array(v.number())
})

export const CreateUser = v.object({
    email: v.string().assert((v) => {return Boolean(v.match("/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/"))}),
    password: v.string()
})