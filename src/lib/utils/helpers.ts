import {DateTime} from "luxon";
import * as v from "@badrap/valita";

export const validateDate = (str: string | undefined) => {
    if (str) {
        const date = DateTime.fromISO(str)
        if (date.invalidReason) {
            console.log(date.invalidReason)
            return v.err("Death not ISO 8601 compliant")
        }
        return v.ok(date)
    } else {
        return v.err("empty")
    }
}