<!--
  - This Source Code Form is subject to the terms of the Mozilla Public
  - License, v. 2.0. If a copy of the MPL was not distributed with this
  - file, You can obtain one at https://mozilla.org/MPL/2.0/.
  -->
<script lang="ts">
	// import {WassertestTypen, type_map, einheiten_map, validateDate} from "$lib/utils/helpers";
	import { DateTime } from 'luxon';
	import * as v from '@badrap/valita';
	import Spinner from '$lib/components/Spinner.svelte';
	import { PostFish } from '$lib/schemas';

	/*    let test_data = {
            type_id: undefined,
            zeit: DateTime.now().toFormat("yyyy-LL-dd'T'HH:mm"),
            wert: "",
            einheit: undefined
        }*/

	let data = {
		name: '',
		birthday: undefined,
		// death: undefined
		lat_name: '',
		food: []
	};

	let available_food_types = [];

	const get_available_food_types = async () => {
		const res = await fetch('/api/v1/food/types');
		available_food_types = await res.json();
		console.log(available_food_types);
		return available_food_types;
	};

	const saveFish = async () => {
		if (!isValid) {
			return;
		}
		const res = await fetch('/api/v1/fish', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		if (res.ok) {
			window.location.assign('/fishes');
		} else {
			alert(`An error occured: \n${await res.text()}`);
		}
	};

	let isValid = false;
	const checkIfSchemaIsValid = (data): boolean => {
		if (!data) {
			return false;
		}
		console.log(data);
		try {
			PostFish.parse({ ...data });
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

<!--
  - This Source Code Form is subject to the terms of the Mozilla Public
  - License, v. 2.0. If a copy of the MPL was not distributed with this
  - file, You can obtain one at https://mozilla.org/MPL/2.0/.
  -->



<div class="flex justify-center w-screen h-screen">
	<form
		class="bg-gray-200 rounded-lg my-auto flex flex-col py-8 px-4"
		on:submit|preventDefault={saveFish}
	>
		<div class="flex flex-col gap-6 border border-red-400 rounded-lg p-2 mb-8">
			<h3 class="italic text-center text-lg">Erforderlich</h3>
			{#await get_available_food_types()}
				<Spinner />
			{:then types}
				<div class="flex flex-row align-middle">
					<label for="Futter-Typ" class="my-auto"> Futter-Typ </label>
					<select
						bind:value={data.food}
						multiple
						id="Futter-Typ"
						title="Futter-Typ"
						name="Futter-Typ"
						class="inline-block ml-2"
					>
						<!--                        <option value="" selected disabled hidden>Auswählen...</option>-->
						{#each types as type}
							<option value={type.id}>{type.name}</option>
						{/each}
					</select>
				</div>
				<p />
			{/await}

			<label>
				Name
				<input bind:value={data.name} class="inline-block ml-2" />
			</label>
			<label>
				Lateinischer Name
				<input bind:value={data.lat_name} class="inline-block ml-2" />
			</label>
		</div>
		<div class="flex flex-col gap-6 border border-green-400 rounded-lg p-2 mb-8">
			<h3 class="italic text-center text-lg">Optional</h3>
			<label>
				Geburtsdatum
				<input bind:value={data.birthday} type="date" class="inline-block ml-2" />
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
