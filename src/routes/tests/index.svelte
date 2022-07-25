<!--
  - This Source Code Form is subject to the terms of the Mozilla Public
  - License, v. 2.0. If a copy of the MPL was not distributed with this
  - file, You can obtain one at https://mozilla.org/MPL/2.0/.
  -->
<script lang="ts">
	import Spinner from '$lib/components/Spinner.svelte';
	import { DateTime } from 'luxon';
	import { einheiten_map, type_map } from '$lib/utils/helpers';

	const get_posts = async () => {
		const res = await fetch('/api/v1/tests?limit=30');
		return await res.json();
	};

	let tests_promise = get_posts();
</script>

<div class="flex justify-center w-screen">
	<a
		class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-xl"
		href="/tests/create"
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
		<span class="text-black">Test hinzufügen</span>
	</a>
</div>
{#await tests_promise}
	<Spinner />
{:then tests}
	<div>
		<div class="overflow-x-auto relative">
			<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead
					class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
				>
					<tr>
						<th scope="col" class="py-3 px-6"> Typ </th>
						<th scope="col" class="py-3 px-6"> Wert </th>
						<th scope="col" class="py-3 px-6"> Einheit </th>
						<th scope="col" class="py-3 px-6"> Datum </th>
					</tr>
				</thead>
				<tbody>
					{#each tests as test}
						<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
							<th
								scope="row"
								class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
							>
								{type_map[test.type]}
							</th>
							<td class="py-4 px-6">
								{test.wert}
							</td>
							<td class="py-4 px-6">
								{test.einheit ?? einheiten_map[test.type]}
							</td>
							<td class="py-4 px-6">
								{DateTime.fromISO(test.zeit).toLocaleString({
									weekday: 'short',
									month: 'short',
									day: '2-digit',
									hour: '2-digit',
									minute: '2-digit'
								})}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/await}
