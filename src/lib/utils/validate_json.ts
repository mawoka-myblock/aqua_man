/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as v from '@badrap/valita';

export type ValidationError = { status: number; body: { detail: string | object } };

export const validate_json = async (
	request: Request,
	valita_obj: v.ObjectType | v.ArrayType
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<[any | ValidationError, boolean]> => {
	let json;
	try {
		json = await request.json();
	} catch {
		return [
			{
				status: 400,
				body: {
					detail: "Body doesn't contain valid JSON!"
				}
			},
			false
		];
	}
	let data: v.Infer<typeof valita_obj>;
	try {
		data = valita_obj.parse(json);
	} catch (err) {
		if (!(err instanceof v.ValitaError)) throw err;
		const errors: object = err.issues;
		return [
			{
				status: 400,
				body: {
					detail: errors
				}
			},
			false
		];
	}
	return [data, true];
};
