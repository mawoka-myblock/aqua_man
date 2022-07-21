import * as v from "@badrap/valita";

export type ValidationError = { status: number, body: { detail: string | object } }


export const validate_json = async (request: Request, valita_obj: v.ObjectType| v.ArrayType): Promise<[any | ValidationError, boolean]> => {
    let json
    try {
        json = await request.json()

    } catch {
        return [{
            status: 400,
            body: {
                detail: "Body doesn't contain valid JSON!"
            }
        }, false]
    }
    let data: v.Infer<typeof valita_obj>
    try {
        data = valita_obj.parse(json)
    } catch (err) {
        if (!(err instanceof v.ValitaError)) throw err
        const errors: object = err.issues
        return [{
            status: 400,
            body: {
                detail: errors
            }
        }, false]
    }
    return [data, true]
}