<!--
  - This Source Code Form is subject to the terms of the Mozilla Public
  - License, v. 2.0. If a copy of the MPL was not distributed with this
  - file, You can obtain one at https://mozilla.org/MPL/2.0/.
  -->
<script lang="ts">
	// import {WassertestTypen, type_map, einheiten_map, validateDate} from "$lib/utils/helpers";
	import { PostFood } from '$lib/schemas';
	import { DateTime } from 'luxon';
	import * as v from '@badrap/valita';
	import Spinner from '$lib/components/Spinner.svelte';

	/*    let test_data = {
            type_id: undefined,
            zeit: DateTime.now().toFormat("yyyy-LL-dd'T'HH:mm"),
            wert: "",
            einheit: undefined
        }*/

	let data = {
		type_id: undefined,
		mhd: undefined,
		producer: undefined,
		buying_date: DateTime.now().toISODate(),
		amount: undefined,
		name: undefined
	};

	let available_food_types = [];

	const get_available_food_types = async () => {
		const res = await fetch('/api/v1/food/types');
		available_food_types = await res.json();
		return available_food_types;
	};

	const saveTest = async () => {
		if (!isValid) {
			return;
		}
		const res = await fetch('/api/v1/food', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		if (res.ok) {
			window.location.assign('/food/food');
		} else {
			alert(`An error occured: \n${await res.text()}`);
		}
	};

	let isValid = false;
	const checkIfSchemaIsValid = (data): boolean => {
		if (!data) {
			return false;
		}
		try {
			PostFood.parse({ ...data, amount: data.amount === null ? undefined : data.amount });
			return true;
		} catch (e) {
			if (!(e instanceof v.ValitaError)) throw e;
			return false;
		}
	};
	$: isValid = checkIfSchemaIsValid(data);
</script>

<!--
  - This Source Code Form is subject to the terms of the Mozilla Public
  - License, v. 2.0. If a copy of the MPL was not distributed with this
  - file, You can obtain one at https://mozilla.org/MPL/2.0/.
  -->

<div class="flex justify-center w-screen h-screen">
	<form
		class="bg-gray-200 rounded-lg my-auto flex flex-col py-8 px-4"
		on:submit|preventDefault={saveTest}
	>
		<div class="flex flex-col gap-6 border border-red-400 rounded-lg p-2 mb-8">
			<h3 class="italic text-center text-lg">Erforderlich</h3>
			{#await get_available_food_types()}
				<Spinner />
			{:then types}
				<label>
					Futter-Typ
					<select
						bind:value={data.type_id}
						title="Futter-Typ"
						name="Futter-Typ"
						class="inline-block ml-2"
					>
						<option value="" selected disabled hidden>Auswählen...</option>
						{#each types as type}
							<option value={type.id}>{type.name}</option>
						{/each}
					</select>
				</label>
			{/await}

			<label>
				Name
				<input bind:value={data.name} class="inline-block ml-2" />
			</label>
			<label>
				Hersteller
				<input bind:value={data.producer} class="inline-block ml-2" />
			</label>
		</div>
		<div class="flex flex-col gap-6 border border-green-400 rounded-lg p-2 mb-8">
			<h3 class="italic text-center text-lg">Optional</h3>
			<label>
				Kaufdatum
				<input bind:value={data.buying_date} type="date" class="inline-block ml-2" />
			</label>
			<label>
				Mindestens haltbar bis
				<input bind:value={data.mhd} type="date" class="inline-block ml-2" />
			</label>
			<label>
				Menge
				<input bind:value={data.amount} type="number" step="0.00001" class="inline-block ml-2" />
			</label>
		</div>

		<button
			type="submit"
			class="py-1 px-3 bg-green-300 rounded-lg disabled:opacity-50"
			disabled={!isValid}
		>
			Speichern!
		</button>
	</form>
</div>
