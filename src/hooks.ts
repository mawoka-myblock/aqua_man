/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */

import type { GetSession, Handle } from '@sveltejs/kit';
import { parse as CookieParse, serialize as CookieSerialize } from 'cookie';
import pkg from 'jsonwebtoken';
const { verify, sign } = pkg;
import { prisma } from '$lib/utils/clients';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = CookieParse(event.request.headers.get('Cookie') ?? '');
	const key = process.env.SECRET_KEY;
	if (!key) {
		throw 'SECRET_KEY is invalid';
	}
	if (cookies.jwt) {
		const jwt_res = verify(cookies.jwt, key);
		if (jwt_res) {
			// @ts-ignore
			event.locals.email = jwt_res['email'];
			// @ts-ignore
			event.locals.id = jwt_res['id'];
		}
		return resolve(event);
	}
	if (cookies.rememberme) {
		const user = await prisma.user.findFirst({
			where: {
				remember_keys: {
					has: cookies.rememberme
				}
			}
		});
		if (user) {
			event.locals.id = user.id;
			event.locals.email = user.email;
			const jwt = sign({ id: user.id, email: user.email }, key, { expiresIn: '1h' });
			const jwt_cookie = CookieSerialize('jwt', jwt, { httpOnly: true, path: '/', maxAge: 3600 });
			const resp = await resolve(event);
			resp.headers.append('Set-Cookie', jwt_cookie);
			return resp;
		} else {
			event.locals.id = undefined;
			event.locals.email = undefined;
			return resolve(event);
		}
	}
	event.locals.id = undefined;
	event.locals.email = undefined;
	return resolve(event);
};

export const getSession: GetSession = (event) => {
	return {
		id: event.locals.id,
		email: event.locals.email
	};
};
