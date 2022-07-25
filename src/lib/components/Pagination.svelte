<!--
  - This Source Code Form is subject to the terms of the Mozilla Public
  - License, v. 2.0. If a copy of the MPL was not distributed with this
  - file, You can obtain one at https://mozilla.org/MPL/2.0/.
  -->
<script lang="ts">
	export let page: number;
	export let next_page_available: boolean;
</script>

<div class="flex w-full mt-auto justify-center">
	<div class="inline-flex items-center justify-center py-1 text-white bg-blue-600 rounded mb-1">
		<button
			on:click={() => {
				page = page - 1;
			}}
			class="inline-flex items-center justify-center w-8 h-8 disabled:opacity-30"
			disabled={page === 1}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="w-6 h-6"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>

		<span class="w-px h-4 bg-white/25" />

		<span class="w-px h-4 bg-white/25" />

		<button
			on:click={() => {
				page = page + 1;
			}}
			disabled={!next_page_available}
			class="inline-flex items-center justify-center w-8 h-8 disabled:opacity-30"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="w-6 h-6"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	</div>
</div>
