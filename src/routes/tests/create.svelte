<!--
  - This Source Code Form is subject to the terms of the Mozilla Public
  - License, v. 2.0. If a copy of the MPL was not distributed with this
  - file, You can obtain one at https://mozilla.org/MPL/2.0/.
  -->

<script lang="ts">
    import {WassertestTypen, type_map, einheiten_map} from "$lib/utils/helpers";
    import {DateTime} from "luxon";
    import * as v from "@badrap/valita";

    let test_data = {
        typ: undefined,
        zeit: DateTime.now().toFormat("yyyy-LL-dd'T'HH:mm"),
        wert: "",
        einheit: undefined
    }

    const schema = v.object({
        typ: v.string(),
        zeit: v.string().assert((v) => v.length !== 0, "Must be longer than 0"),
        wert: v.number(),
        einheit: v.string().assert((v) => v.length !== 0, "Must be longer than 0")
    })


    const saveTest = async () => {
        if (!isValid) {
            return
        }
        const res = await fetch("/api/v1/tests", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                value: test_data.wert,
                type: test_data.typ,
                unit: test_data.einheit,
                time: DateTime.fromFormat(test_data.zeit, "yyyy-LL-dd'T'HH:mm").toISO()
            })
        })
        console.log("Hi!")
        if (res.ok) {
            window.location.assign("/tests")
        } else {
            alert(`An error occured: \n${await res.text()}`)
        }
    }

    let isValid = false
    const checkIfSchemaIsValid = (data): boolean => {
        try {
            schema.parse(data)
            return true
        } catch (e) {
            if (!(e instanceof v.ValitaError)) throw e
            return false
        }
    }
    $: isValid = checkIfSchemaIsValid(test_data)
    const wassertypen_array = Object.keys(WassertestTypen).filter((v) => isNaN(Number(v)));
</script>


<div class="flex justify-center w-screen h-screen">
    <form class="bg-gray-200 rounded-lg my-auto flex flex-col py-8 px-4 gap-6" on:submit|preventDefault={saveTest}>

        <label>
            Test-Typ
            <select bind:value={test_data.typ} title="Test-Typ" name="Test-Typ" class="inline-block ml-2"
                    on:change={() => {test_data.einheit = einheiten_map[test_data.typ]}}>
                <option value="" selected disabled hidden>Auswählen...</option>

                {#each wassertypen_array as type}
                    <option value={type}>{type_map[type]}</option>
                {/each}

            </select>
        </label>
        <label>
            Wert
            <input bind:value={test_data.wert} type="number" step="0.0000001" class="inline-block ml-2">
        </label>
        <label>
            Einheit
            <input bind:value={test_data.einheit} class="inline-block ml-2">
        </label>
        <label>
            Zeit
            <input bind:value={test_data.zeit} type="datetime-local" class="inline-block ml-2">
        </label>

        <button type="submit" class="py-1 px-3 bg-green-300 rounded-lg disabled:opacity-50" disabled={!isValid}>
            Speichern!
        </button>
    </form>
</div>