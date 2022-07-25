/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { RequestHandler } from '@sveltejs/kit';
import { validate_json } from '$lib/utils/validate_json';
import { prisma, Prisma } from '$lib/utils/clients';
import type { Infer } from '@badrap/valita';
import { PostFood, PatchFood } from '$lib/schemas';

type PostFoodType = Infer<typeof PostFood>;

const PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.id) {
		return {
			status: 401
		};
	}
	const res = await validate_json(request, PostFood);
	if (!res[1]) {
		return res[0];
	}

	const data: PostFoodType = res[0];
	try {
		const res = await prisma.fressen.create({
			data: {
				user_id: locals.id,
				type_id: data.type_id,
				mhd: data.mhd === undefined ? undefined : data.mhd.toJSDate(),
				hersteller: data.producer,
				kauf_datum: data.buying_date === undefined ? undefined : data.buying_date.toJSDate(),
				menge: data.amount,
				name: data.name
			}
		});
		return {
			status: 201,
			body: res
		};
	} catch (e) {
		if (e instanceof PrismaClientKnownRequestError) {
			if (e.code === 'P2003') {
				return {
					status: 404,
					body: {
						detail: 'type_id invalid!'
					}
				};
			} else {
				return {
					status: 500,
					body: {
						detail: e.message,
						code: e.code
					}
				};
			}
		} else {
			throw e;
		}
	}
};

export const GET: RequestHandler = async ({ url, locals }) => {
	if (!locals.id) {
		return {
			status: 401
		};
	}
	const include_empty = Boolean(url.searchParams.get('include_empty'));
	const offset = parseInt(url.searchParams.get('offset') ?? '0');
	const limit = parseInt(url.searchParams.get('limit') ?? '30');

	const res = await prisma.fressen.findMany({
		take: limit,
		skip: offset,
		where: {
			leer: include_empty ? undefined : false,
			user_id: locals.id
		},
		orderBy: {
			kauf_datum: 'desc'
		},
		include: {
			fressen_typen: {
				select: {
					name: true
				}
			}
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

export const PATCH: RequestHandler = async ({ request, locals }) => {
	if (!locals.id) {
		return {
			status: 401
		};
	}
	const res = await validate_json(request, PatchFood);
	if (!res[1]) {
		return res[0];
	}
	const data: Infer<typeof PatchFood> = res[0];

	try {
		const res = await prisma.fressen.update({
			where: {
				id: data.id,
				user_id: locals.id
			},
			data: {
				type_id: data.type_id,
				mhd: data.mhd === undefined ? undefined : data.mhd.toJSDate(),
				hersteller: data.producer,
				kauf_datum: data.buying_date === undefined ? undefined : data.buying_date.toJSDate(),
				menge: data.amount,
				name: data.name,
				leer: data.empty
			}
		});
		return {
			status: 200,
			body: res
		};
	} catch (e) {
		if (e instanceof PrismaClientKnownRequestError) {
			return {
				status: 500,
				body: {
					detail: e.message
				}
			};
		} else {
			throw e;
		}
	}
};
