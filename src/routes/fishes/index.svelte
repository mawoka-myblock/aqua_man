<!--
  - This Source Code Form is subject to the terms of the Mozilla Public
  - License, v. 2.0. If a copy of the MPL was not distributed with this
  - file, You can obtain one at https://mozilla.org/MPL/2.0/.
  -->
<script lang="ts">
	import Spinner from '$lib/components/Spinner.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { DateTime } from 'luxon';

	let page = 1;
	let next_page_available = false;
	const get_fishes = async () => {
		const res = await fetch(`/api/v1/fish?offset=${(page - 1) * 20}&limit=20`);
		const data = await res.json();
		console.log(data);
		if (data.length === 20) {
			next_page_available = true;
		}
		return data;
	};
	let available_food_types = [];

	const get_available_food_types = async () => {
		const res = await fetch('/api/v1/food/types');
		available_food_types = await res.json();
		return available_food_types;
	};

	let fishes_promise = get_fishes();

	$: {
		page;
		fishes_promise = get_fishes();
	}
</script>

{#await fishes_promise}
	<Spinner />
{:then fishes}
	{#await get_available_food_types()}
		<Spinner />
	{:then food_types}
		<div class="flex w-screen h-screen flex-col">
			<div class="w-screen">
				<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
					>
						<tr>
							<th scope="col" class="py-3 px-6"> Name </th>
							<th scope="col" class="py-3 px-6"> Art/Lat. Name </th>
							<th scope="col" class="py-3 px-6"> Geburtsdatum / Tod </th>
							<th scope="col" class="py-3 px-6"> Fressen </th>
						</tr>
					</thead>
					<tbody>
						{#each fishes as fish}
							<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
								<th
									scope="row"
									class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
								>
									{fish.name}
								</th>
								<td class="py-4 px-6">
									{fish.lat_name}
								</td>
								<td class="py-4 px-6">
									{DateTime.fromISO(fish.geburtsdatum).toLocaleString({
										weekday: 'short',
										month: 'short',
										day: '2-digit'
									})}
									{#if fish.tod}
										/ {DateTime.fromISO(fish.tod).toLocaleString({
											weekday: 'short',
											month: 'short',
											day: '2-digit'
										})}
									{/if}
								</td>
								<td class="py-4 px-6">
									<p>
										{#each fish.fische_fressen as food, index}
											{#if index !== 0}, {/if}{food.fressen_typen.name}
										{/each}
									</p>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<Pagination bind:next_page_available bind:page />
		</div>
	{/await}
{/await}
