/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { RequestHandler } from '@sveltejs/kit';
import { validate_json } from '$lib/utils/validate_json';
import { prisma, Prisma } from '$lib/utils/clients';
import * as v from '@badrap/valita';

const PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;
const PostFoodType = v.object({
	name: v.string()
});
type PostFoodTypeType = v.Infer<typeof PostFoodType>;

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.id) {
		return {
			status: 401
		};
	}
	const res = await validate_json(request, PostFoodType);
	if (!res[1]) {
		return res[0];
	}
	const data: PostFoodTypeType = res[0];
	try {
		const db_res = await prisma.fressenTypen.create({
			data: {
				name: data.name,
				user_id: locals.id
			}
		});
		return {
			status: 201,
			body: db_res
		};
	} catch (e) {
		if (e instanceof PrismaClientKnownRequestError) {
			if (e.code === 'P2002') {
				return {
					status: 409,
					body: {
						details: 'A food-type with the same name is already existing.'
					}
				};
			} else {
				throw e;
			}
		} else {
			throw e;
		}
	}
};

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.id) {
		return {
			status: 401
		};
	}
	const res = await prisma.fressenTypen.findMany({
		where: {
			user_id: locals.id
		},
		include: {
			_count: true
		}
	});

	if (res) {
		return {
			status: 200,
			body: res
		};
	} else {
		return {
			status: 404
		};
	}
};
