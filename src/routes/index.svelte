<!--
  - This Source Code Form is subject to the terms of the Mozilla Public
  - License, v. 2.0. If a copy of the MPL was not distributed with this
  - file, You can obtain one at https://mozilla.org/MPL/2.0/.
  -->


<script context="module" lang="ts">

    export const load = async ({session}) => {
        if (session.id) {
            return {
                props: {
                    loggedIn: true
                }
            };
        }
        return {};
    }
</script>

<script lang="ts">
    import {onMount} from "svelte";

    export let loggedIn: boolean

    const links = [
        {
            text: "Wassertests",
            link: "/tests"
        },
        {
            text: "Fische",
            link: "/fishes"
        },
        {
            text: "Futter",
            link: "/food"
        }
    ]
   /* onMount(() => {
        navigator.serviceWorker.ready.then((registration) => {
            navigator.serviceWorker.controller.postMessage({
                type: "lOL!!!"
            })
        })

    })*/
</script>

{#if loggedIn}
    <div class="w-screen h-screen flex justify-center align-middle">
        <div class="my-auto flex flex-col lg:w-1/5 gap-4 w-4/5">
            {#each links as link}
                <a href={link.link}
                   class="text-center py-2 bg-cyan-500 rounded-lg hover:bg-cyan-400 transition focus:ring-[5px] ring-green-600 hover:shadow-2xl">{link.text}</a>
            {/each}
        </div>
    </div>

{:else}
    <h1>Welcome to AquaMan</h1>
{/if}