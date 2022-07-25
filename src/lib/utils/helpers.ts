/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { DateTime } from 'luxon';
import * as v from '@badrap/valita';

export const validateDate = (str: string | undefined) => {
	if (str) {
		const date = DateTime.fromISO(str);
		if (date.invalidReason) {
			return v.err('Death not ISO 8601 compliant');
		}
		return v.ok(date);
	} else {
		return v.err('empty');
	}
};

export const possible_test_types = v.union(
	v.literal('PH_WERT'),
	v.literal('GH'),
	v.literal('KH'),
	v.literal('PHOSPHAT'),
	v.literal('NITRIT'),
	v.literal('NITRAT'),
	v.literal('EISEN'),
	v.literal('KUPFER'),
	v.literal('SILIKAT'),
	v.literal('SAUERSTOFF'),
	v.literal('AMMONIUM'),
	v.literal('CO2')
);

export enum WassertestTypen {
	PH_WERT, // ph-Wert
	GH, // Gesamthärte
	KH, // Karbonhärte
	PHOSPHAT,
	NITRIT,
	NITRAT,
	EISEN,
	KUPFER,
	SILIKAT,
	SAUERSTOFF,
	AMMONIUM,
	CO2
}

export const type_map = {
	PH_WERT: 'pH-Wert',
	GH: 'Gesamthärte',
	KH: 'Karbonhärte',
	PHOSPHAT: 'Phosphat',
	NITRIT: 'Nitrit',
	NITRAT: 'Nitrat',
	EISEN: 'Eisen',
	KUPFER: 'Kupfer',
	SILIKAT: 'Silikat',
	SAUERSTOFF: 'Sauerstoff',
	AMMONIUM: 'Ammonium',
	CO2: 'Co2'
};
export const einheiten_map = {
	PH_WERT: '-',
	GH: '°dH',
	KH: '°dKH',
	PHOSPHAT: 'mg/l',
	NITRIT: 'mg/l',
	NITRAT: 'mg/l',
	EISEN: 'mg/l',
	KUPFER: 'mg/l',
	SILIKAT: 'mg/l',
	SAUERSTOFF: 'mg/l',
	AMMONIUM: 'mg/l',
	CO2: 'mg/l'
};
