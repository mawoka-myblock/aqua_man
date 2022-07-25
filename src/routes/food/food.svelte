<script lang="ts">
	import Spinner from '$lib/components/Spinner.svelte';
	import { DateTime } from 'luxon';
	import { einheiten_map, type_map } from '$lib/utils/helpers';

	let page = 1;
	let next_page_available = false;
	const get_foods = async () => {
		const res = await fetch(`/api/v1/food?offset=${(page - 1) * 20}&limit=20`);
		const data = await res.json();
		if (data.length === 20) {
			next_page_available = true;
		}
		return data;
	};

	const check_if_food_types_available = async () => {
		const res = await fetch('/api/v1/food/types/count');
		const count = (await res.json()).count;
		return count !== 0;
	};

	let foods_promise = get_foods();
</script>

{#await check_if_food_types_available()}
	<Spinner />
{:then food_available}
	{#if food_available}
		<div class="flex justify-center w-screen">
			<a
				class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-xl"
				href="/food/add"
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
				<span class="text-black">Futter hinzufügen</span>
			</a>
		</div>
	{:else}
		<div class="flex justify-center w-screen">
			<a
				class="bg-white rounded-md pt-2 px-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-xl"
				href="/food/types"
			>
				<svg
					class="w-12 h-12 text-red-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
				<span class="text-black">Futter-Typen hinzufügen</span>
				<br />
			</a>
		</div>
		<p class="text-center w-screen text-sm italic mb-2 -mt-1">
			Du musst erst einen Futter-Typen haben, bevor du Futter hinzufügen kannst!
		</p>
	{/if}
{/await}
{#await foods_promise}
	<Spinner />
{:then foods}
	<div>
		<div class="overflow-x-auto relative">
			<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead
					class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
				>
					<tr>
						<th scope="col" class="py-3 px-6"> Name </th>
						<th scope="col" class="py-3 px-6"> Hersteller </th>
						<th scope="col" class="py-3 px-6"> Typ </th>
						<th scope="col" class="py-3 px-6"> Noch da? / Menge </th>
					</tr>
				</thead>
				<tbody>
					{#each foods as food}
						<tr
							class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
							on:click={() => {
								window.location.assign(`/food/view/${food.id}`);
							}}
						>
							<th
								scope="row"
								class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
							>
								{food.name}
							</th>
							<td class="py-4 px-6">
								{food.hersteller}
							</td>
							<td class="py-4 px-6">
								{food.fressen_typen.name}
							</td>
							<td class="py-4 px-6">
								{#if food.leer}
									❌
								{:else}
									✅
								{/if}
								{#if food.menge}
									/ {food.menge}
								{/if}
							</td>
							<!-- <td class="py-4 px-6">
                             {DateTime.fromISO(test.zeit).toLocaleString({
                                 weekday: 'short',
                                 month: 'short',
                                 day: '2-digit',
                                 hour: '2-digit',
                                 minute: '2-digit'
                             })}
                         </td>-->
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/await}
