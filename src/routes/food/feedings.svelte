<!--
  - This Source Code Form is subject to the terms of the Mozilla Public
  - License, v. 2.0. If a copy of the MPL was not distributed with this
  - file, You can obtain one at https://mozilla.org/MPL/2.0/.
  -->


<script lang="ts">

    import Spinner from "$lib/components/Spinner.svelte";
    import {DateTime} from "luxon";
    import Pagination from "$lib/components/Pagination.svelte";


    let page = 1
    let next_page_available = false
    const get_feedings = async () => {
        const res = await fetch(`/api/v1/feedings?offset=${(page - 1) * 20}&limit=20`)
        const data = await res.json()
        if (data.length === 20) {
            next_page_available = true
        }
        return data
    }
    let feedings_promise = get_feedings()

    $: {
        page;
        feedings_promise = get_feedings()
    }
</script>
{#await feedings_promise}
    <Spinner/>
{:then feedings}
    <div class="flex w-screen h-screen flex-col">
        <div class="w-screen">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="py-3 px-6">
                        Zeit
                    </th>
                    <th scope="col" class="py-3 px-6">
                        Futter
                    </th>
                    <th scope="col" class="py-3 px-6">
                        Futter-Typ
                    </th>
                </tr>
                </thead>
                <tbody>
                {#each feedings as feeding}
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row"
                            class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {DateTime.fromISO(feeding.zeit).toLocaleString({
                                weekday: 'short',
                                month: 'short',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </th>
                        <td class="py-4 px-6">
                            {feeding.futter.name} von {feeding.futter.hersteller}
                        </td>
                        <td class="py-4 px-6">
                            {feeding.futter.fressen_typen.name}
                        </td>

                    </tr>
                {/each}
                </tbody>
            </table>
        </div>
        <Pagination bind:next_page_available bind:page/>
    </div>

{/await}