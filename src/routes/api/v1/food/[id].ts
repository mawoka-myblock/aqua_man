/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/utils/clients';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.id) {
		return {
			status: 401
		};
	}
	const id = parseInt(params.id);
	if (isNaN(id)) {
		return {
			status: 400,
			body: {
				detail: "id isn't a number"
			}
		};
	}

	const res = await prisma.fressen.findUnique({
		where: {
			id: id,
			user_id: locals.id
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
