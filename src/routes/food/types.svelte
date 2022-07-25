<!--
  - This Source Code Form is subject to the terms of the Mozilla Public
  - License, v. 2.0. If a copy of the MPL was not distributed with this
  - file, You can obtain one at https://mozilla.org/MPL/2.0/.
  -->
<script lang="ts">
	import Spinner from '$lib/components/Spinner.svelte';

	const get_types = async () => {
		const res = await fetch('/api/v1/food/types');
		return await res.json();
	};

	const add_type = async () => {
		const name = window.prompt('bitte gib den Futter-Typen ein.');
		if (!name) {
			alert('Typ war leer');
			return;
		}
		const res = await fetch('/api/v1/food/types', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: name })
		});
		if (res.ok) {
			types_promise = get_types();
		} else if (res.status === 409) {
			alert('Der Typ existiert schon!');
		} else {
			console.error(await res.json());
			alert('Unerwarter Fehler!');
		}
	};

	let types_promise = get_types();
</script>

<div class="flex justify-center w-screen">
	<button
		class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-xl"
		on:click={add_type}
	>
		<svg
			class="w-12 h-12"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 6v6m0 0v6m0-6h6m-6 0H6"
			/>
		</svg>
		<span class="text-black">Typen hinzufügen</span>
	</button>
</div>
{#await types_promise}
	<Spinner />
{:then typen}
	<div>
		<div class="overflow-x-auto relative">
			<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead
					class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
				>
					<tr>
						<th scope="col" class="py-3 px-6"> Typ </th>
						<th scope="col" class="py-3 px-6"> Menge </th>
					</tr>
				</thead>
				<tbody>
					{#each typen as type}
						<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
							<th
								scope="row"
								class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
							>
								{type.name}
							</th>
							<td class="py-4 px-6">
								{type._count.fressen}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/await}
