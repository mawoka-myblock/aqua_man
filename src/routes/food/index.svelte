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
            link: "/food/food"
        },
        {
            text: "Fütterungen",
            link: "/food/feedings"
        },
    ]
    const miniSearch = new MiniSearch({
        fields: ["hersteller", "name"],
        storeFields: ["id", "hersteller", "name", "type"]
    })
    let food_list
    const list_foods = async () => {
        const res = await fetch(`/api/v1/food?limit=50`)
        food_list = await res.json()
        for (let i = 0; i < food_list.length; i++) {
            food_list[i].type = food_list[i].fressen_typen.name
        }
        await miniSearch.addAllAsync(food_list)

    }

    let food_query = ""
    let search_suggestions = []
    let search_results = []
    let selected_food_id = undefined

    const set_search_suggestions = () => {
        if (selected_food_id) {
            return
        }
        search_suggestions = miniSearch.autoSuggest(food_query, {maxFuzzy: 3})
    }


    const set_search_results = () => {
        if (selected_food_id) {
            return
        }
        if (food_query.length >= 3) {
            search_results = miniSearch.search(food_query, {maxFuzzy: 3})
        }

    }


    $: {
        food_query;
        set_search_suggestions();
        set_search_results()
    }


    const check_if_food_selected = (query: string) => {
        if (query === "") {
            selected_food_id = undefined
        }
    }
    $: {
        check_if_food_selected(food_query)
    }


    const save_feeding = async () => {
        if (!selected_food_id) {
            return
        }
        const res = await fetch("/api/v1/feedings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({food: selected_food_id})
        })
        if (res.ok) {
            window.location.reload()
        } else {
            alert(`An error occurred:\n${await res.json()}`)
        }
    }

    let feedingModalOpen = false
</script>

{#if feedingModalOpen}

    {#await list_foods()}
        <Spinner/>
    {:then _}
        <div class="fixed top-0 left-0 z-50 w-full h-full visible bg-white">
            <button class="bg-gray-200 rounded-lg p-1 m-2 hover:bg-gray-300 transition group"
                    on:click={() => {feedingModalOpen = false}}>
                <svg class="w-8 h-8 text-gray-400 group-hover:text-gray-500 transition" fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
            <div class="flex justify-center w-full h-full">
                <form class="my-auto bg-gray-300 py-4 px-6 flex flex-col" on:submit|preventDefault={save_feeding}>
                    <input bind:value={food_query} on:change={set_search_results}>
                    {#if search_suggestions.length !== 0 && search_results.length === 0}
                        <ul class="relative bg-white mt-0.5">
                            {#each search_suggestions as res}
                                <li>
                                    <button class="w-full"
                                            on:click={() => {search_suggestions = []; food_query = res.suggestion}}>{res.suggestion}</button>
                                </li>
                            {/each}
                        </ul>
                    {/if}
                    {#if search_results.length !== 0 && !selected_food_id}
                        <ul class="relative bg-white mt-0.5">
                            {#each search_results as res}
                                <li>
                                    <button class="w-full"
                                            on:click={() => {food_query = `${res.name} von ${res.hersteller}`; selected_food_id = res.id; search_results = []; search_suggestions = []}}>
                                        <span>{res.name} <span class="text-xs italic">({res.type})</span></span>
                                        <span class="text-xs">Von {res.hersteller}</span>
                                    </button>
                                </li>
                            {/each}
                        </ul>
                    {/if}
                    <button type="submit" class="py-1 px-3 bg-green-300 rounded-lg disabled:opacity-50 mt-4" disabled={!selected_food_id}>
                        Speichern!
                    </button>
                </form>
            </div>
        </div>
    {/await}
{/if}
<div class="w-screen h-screen flex justify-center align-middle">
    <div class="my-auto flex flex-col lg:w-1/5 gap-4 w-4/5">
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



