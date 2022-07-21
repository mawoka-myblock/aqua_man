<!--
  - This Source Code Form is subject to the terms of the Mozilla Public
  - License, v. 2.0. If a copy of the MPL was not distributed with this
  - file, You can obtain one at https://mozilla.org/MPL/2.0/.
  -->

<script lang="ts">

    import MiniSearch from 'minisearch'
    import Spinner from "$lib/components/Spinner.svelte";

    const links = [
        {
            text: "Futter",
            link: "/tests"
        },
        {
            text: "Fütterungen",
            link: "/fishes"
        },
    ]
    const miniSearch = new MiniSearch({
        fields: ["hersteller", "name"],
        storeFields: ["id"]
    })
    let food_list
    const list_foods = async () => {
        const res = await fetch(`/api/v1/food?limit=50`)
        food_list = await res.json()
        await miniSearch.addAllAsync(food_list)

    }

    let food_query = ""
    let search_suggestions = []

    const set_search_results = () => {
        search_suggestions = miniSearch.autoSuggest(food_query, {maxFuzzy: 3})
        console.log(search_suggestions)
    }

    $: {
        food_query;
        set_search_results()
    }


    let feedingModalOpen = true
</script>

{#if feedingModalOpen}

    {#await list_foods()}
        <Spinner/>
    {:then _}
        <div class="fixed top-0 left-0 z-50 w-full h-full visible bg-white">
            <button class="bg-gray-200 rounded-lg p-1 m-2 hover:bg-gray-300 transition group">
                <svg class="w-8 h-8 text-gray-400 group-hover:text-gray-500 transition" fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
            <div class="flex justify-center w-full h-full">
                <form class="my-auto bg-gray-300 py-4 px-6 flex flex-col" on:submit|preventDefault>
                    <input bind:value={food_query} on:change={set_search_results}>
                    {#if search_suggestions.length !== 0}
                        <ul class="relative bg-white mt-0.5">
                            {#each search_suggestions as res}
                                <li><button class="w-full" on:click={() => {search_suggestions = []; food_query = res.suggestion}}>{res.suggestion}</button></li>
                            {/each}
                        </ul>
                    {/if}
                    <button type="submit" class="py-1 px-3 bg-green-300 rounded-lg disabled:opacity-50 mt-4">
                        Speichern!
                    </button>
                </form>
            </div>
        </div>
    {/await}
{/if}
<div class="w-screen h-screen flex justify-center align-middle">
    <div class="my-auto flex flex-col lg:w-1/5 gap-4">
        {#each links as link}
            <a href={link.link}
               class="text-center py-2 bg-cyan-500 rounded-lg hover:bg-cyan-400 transition focus:ring-[5px] ring-green-600 hover:shadow-2xl">{link.text}</a>
        {/each}
        <button on:click={() => {feedingModalOpen = true}}
                class="text-center py-2 bg-cyan-500 rounded-lg hover:bg-cyan-400 transition focus:ring-[5px] ring-green-600 hover:shadow-2xl">
            Füttern
        </button>
    </div>
</div>



