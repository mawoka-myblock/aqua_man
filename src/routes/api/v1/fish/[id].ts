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

/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '../../../../lib/utils/clients';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.id) {
		return {
			status: 401
		};
	}
	const raw_id = params.id;
	const id = parseInt(raw_id);
	if (isNaN(id)) {
		return {
			status: 400,
			body: {
				detail: "id isn't a number"
			}
		};
	}
	const res = await prisma.fische.findFirst({
		where: {
			id: id,
			user_id: locals.id
		},
		include: {
			fische_fressen: {
				include: {
					fressen_typen: true
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
