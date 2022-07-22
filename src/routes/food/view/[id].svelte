<!--
  - This Source Code Form is subject to the terms of the Mozilla Public
  - License, v. 2.0. If a copy of the MPL was not distributed with this
  - file, You can obtain one at https://mozilla.org/MPL/2.0/.
  -->
<script lang="ts" context="module">
    import type {Load} from "@sveltejs/kit";


    export const load: Load = async ({params}) => {
        return {
            props: {
                id: params.id
            }
        }
    }
</script>


<script lang="ts">
    import Spinner from "$lib/components/Spinner.svelte";
    import {PatchFood} from "$lib/schemas";
    import * as v from "@badrap/valita";
    import {DateTime} from "luxon";

    export let id: number

    let isValid = false
    const checkIfSchemaIsValid = (data: Food): boolean => {
        if (!data) {
            return false
        }
        try {
            PatchFood.parse({...data, amount: data.amount === null ? undefined : data.amount})
            return true
        } catch (e) {
            if (!(e instanceof v.ValitaError)) throw e
            console.log(e.issues)
            return false
        }
    }
    $: isValid = checkIfSchemaIsValid(food_data)


    const save_food = async () => {
        if (!isValid) {
            return
        }
        const res = await fetch(`/api/v1/food`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...food_data,
                amount: food_data.amount === null ? undefined : food_data.amount,
                mhd: food_data.mhd === null ? undefined : food_data.mhd
            })
        })
        if (res.ok) {
            window.location.assign("/food/food")
        } else {
            alert(`An error occured: \n${await res.text()}`)
        }
    }

    interface Food {
        id: number,
        type_id: number,
        mhd?: string,
        producer: string,
        buying_date: string,
        amount?: number,
        empty?: boolean,
        name: "TetraMin",
    }

    let food_data: Food


    const get_food = async () => {
        const res = await fetch(`/api/v1/food/${id}`)
        if (res.ok) {
            let temp_data = await res.json()
            temp_data.buying_date = DateTime.fromISO(temp_data.kauf_datum).toISODate()
            if (temp_data.mhd) {
                temp_data.mhd = DateTime.fromISO(temp_data.mhd).toISODate()
            }
            food_data = {
                id: temp_data.id === null ? undefined : temp_data.id,
                mhd: temp_data.mhd === null ? undefined : temp_data.mhd,
                buying_date: temp_data.buying_date === null ? undefined : temp_data.buying_date,
                amount: temp_data.menge === null ? undefined : temp_data.menge,
                empty: temp_data.leer === null ? undefined : temp_data.leer,
                name: temp_data.name === null ? undefined : temp_data.name,
                producer: temp_data.hersteller === null ? undefined : temp_data.hersteller,
                type_id: temp_data.type_id === null ? undefined : temp_data.type_id
            }
            return temp_data
        } else {
            throw "Food not found!"
        }
    }

    let available_food_types = []


    const get_available_food_types = async () => {
        const res = await fetch("/api/v1/food/types")
        available_food_types = await res.json()
        return available_food_types
    }

    // $: console.log(food_data)
    $: {
        if (food_data) {
            Object.keys(food_data).forEach((key) => {
                // console.log("hi", key)
                if (food_data[key] === null) {
                    console.log(key, "lol")
                    food_data[key] === undefined
                }
            })
            console.log(food_data)
            food_data = food_data
            isValid = checkIfSchemaIsValid(food_data)
        }
    }

    let food_promise = get_food()
</script>


{#await food_promise}
    <Spinner/>
{:then food}
    <div class="flex justify-center w-screen h-screen">
        <form class="bg-gray-200 rounded-lg my-auto flex flex-col py-8 px-4" on:submit|preventDefault={save_food}>

            <div class="flex flex-col gap-6 border border-red-400 rounded-lg p-2 mb-8">
                <h3 class="italic text-center text-lg">Erforderlich</h3>
                {#await get_available_food_types()}
                    <Spinner/>
                {:then types}
                    <label>
                        Futter-Typ
                        <select bind:value={food_data.type_id} title="Futter-Typ" name="Futter-Typ"
                                class="inline-block ml-2">
                            <option value="" selected disabled hidden>Auswählen...</option>
                            {#each types as type}
                                <option value={type.id}>{type.name}</option>
                            {/each}

                        </select>
                    </label>
                {/await}

                <label>
                    Name
                    <input bind:value={food_data.name} class="inline-block ml-2">
                </label>
                <label>
                    Hersteller
                    <input bind:value={food_data.producer} class="inline-block ml-2">
                </label>
            </div>
            <div class="flex flex-col gap-6 border border-green-400 rounded-lg p-2 mb-8">
                <h3 class="italic text-center text-lg">Optional</h3>
                <label>
                    Kaufdatum
                    <input bind:value={food_data.buying_date} type="date" class="inline-block ml-2">
                </label>
                <label>
                    Mindestens haltbar bis
                    <input bind:value={food_data.mhd} type="date" class="inline-block ml-2">
                </label>
                <label>
                    Menge
                    <input bind:value={food_data.amount} type="number" step="0.00001" class="inline-block ml-2">
                </label>
                <div class="flex justify-center w-full">
                    <div class="flex items-center space-x-2">
                        <span class="text-sm font-medium transition" class:text-gray-400={!food_data.empty}>Leer</span>

                        <button
                                on:click={() => {food_data.empty = !food_data.empty}}
                                type="button"
                                role="switch"
                                aria-checked="true"
                                class="relative inline-flex h-5 w-8 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-transparent transition focus:outline-none focus:ring focus:ring-blue-200"
                                class:bg-blue-700={!food_data.empty} class:bg-gray-500={food_data.empty}>
    <span
            aria-hidden="true"
            class="pointer-events-none inline-block h-4 w-4 translate-x-0 rounded-full bg-white transition will-change-transform"
            class:translate-x-3={!food_data.empty}></span>
                        </button>

                        <span class="text-sm font-medium transition" class:text-gray-400={food_data.empty}>Voll</span>
                    </div>
                </div>
            </div>

            <button type="submit" class="py-1 px-3 bg-green-300 rounded-lg disabled:opacity-50" disabled={!isValid}>
                Speichern!
            </button>
        </form>
    </div>

{:catch e}
    <h1 class="text-center text-8xl">Food not found</h1>

{/await}