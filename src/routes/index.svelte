<!--
  - This Source Code Form is subject to the terms of the Mozilla Public
  - License, v. 2.0. If a copy of the MPL was not distributed with this
  - file, You can obtain one at https://mozilla.org/MPL/2.0/.
  -->

<script lang="ts">


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
</script>


<div class="w-screen h-screen flex justify-center align-middle">
    <div class="my-auto flex flex-col lg:w-1/5 gap-4">
        {#each links as link}
            <a href={link.link} class="text-center py-2 bg-cyan-500 rounded-lg hover:bg-cyan-400 transition focus:ring-[5px] ring-green-600 hover:shadow-2xl">{link.text}</a>
        {/each}
    </div>
</div>