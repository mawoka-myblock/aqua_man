<!--
  - This Source Code Form is subject to the terms of the Mozilla Public
  - License, v. 2.0. If a copy of the MPL was not distributed with this
  - file, You can obtain one at https://mozilla.org/MPL/2.0/.
  -->
<script context="module" lang="ts">
	export const load = async ({ session }) => {
		if (session.id) {
			return {
				status: 302,
				redirect: '/'
			};
		}
		return {};
	};
</script>

<script lang="ts">
	// import tippy from 'sveltejs-tippy';
	let loginData = {
		email: '',
		password: ''
	};
	let emailEmpty = true;

	$: emailEmpty = loginData.email === '';

	const login = async (): Promise<void> => {
		if (emailEmpty) {
			return;
		}
		const res = await fetch('/api/v1/users/login', {
			method: 'post',
			body: JSON.stringify({
				email: loginData.email,
				password: loginData.password === '' ? undefined : loginData.password
			})
		});
		if (res.status === 200) {
			window.location.replace('/');
		}
	};
</script>

<div class="flex items-center justify-center h-screen px-4">
	<div>
		<!--<div
			class="flex items-center justify-center p-4 text-green-700 border-2 border-current rounded-lg"
			role="alert"
		>
			<svg
				class="w-6 h-6"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
				/></svg
			>

			<h3 class="ml-3 text-sm font-medium">
				Password isn't required, because you can login via a magic link!
			</h3>
		</div>-->
		<!--		<span class="p-4" />-->

		<div
			class="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800"
		>
			<div class="px-6 py-4">
				<h2 class="text-3xl font-bold text-center text-gray-700 dark:text-white">AquaMan</h2>

				<h3 class="mt-1 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
					Welcome Back
				</h3>

				<p class="mt-1 text-center text-gray-500 dark:text-gray-400">Feel free to log in!</p>

				<form on:submit|preventDefault={login}>
					<div class="w-full mt-4">
						<div class="dark:bg-gray-800 bg-white p-4 rounded-lg">
							<div class="relative bg-inherit w-full">
								<input
									id="email"
									bind:value={loginData.email}
									name="username"
									type="email"
									class="w-full peer bg-transparent h-10 rounded-lg text-gray-700 dark:text-white placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
									placeholder="Email"
								/>
								<label
									for="email"
									class="absolute cursor-text left-0 -top-3 text-sm text-gray-700 dark:text-white bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
								>
									Email
								</label>
							</div>
						</div>
						<div class="dark:bg-gray-800 bg-white p-4 rounded-lg">
							<div class="relative bg-inherit w-full">
								<input
									id="password"
									name="username"
									type="password"
									bind:value={loginData.password}
									class="w-full peer bg-transparent h-10 rounded-lg text-gray-700 dark:text-white placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
									placeholder="Password"
								/>
								<label
									for="password"
									class="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
								>
									Password
								</label>
							</div>
						</div>

						<div class="flex items-center justify-between mt-4">
							<!--<a
								href="/account/reset-password"
								class="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500"
								>Forgot Password?</a
							>-->

							<button
								class="px-4 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded hover:bg-gray-600 focus:outline-none"
								disabled={emailEmpty}
								class:cursor-not-allowed={emailEmpty}
								class:opacity-50={emailEmpty}
								type="submit">Login</button
							>
						</div>
					</div>
				</form>
			</div>

			<div class="flex items-center justify-center py-4 text-center bg-gray-50 dark:bg-gray-700">
				<span class="text-sm text-gray-600 dark:text-gray-200">Don't have an account? </span>

				<a
					href="/account/register"
					class="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline"
					>Register</a
				>
			</div>
		</div>
	</div>
</div>
