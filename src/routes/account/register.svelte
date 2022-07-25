<!--
  - This Source Code Form is subject to the terms of the Mozilla Public
  - License, v. 2.0. If a copy of the MPL was not distributed with this
  - file, You can obtain one at https://mozilla.org/MPL/2.0/.
  -->

<script context="module" lang="ts">
	export async function load({ session }) {
		if (session.id) {
			return {
				status: 302,
				redirect: '/'
			};
		}
		return {};
	}
</script>

<script lang="ts">
	import { createForm } from 'felte';
	// import reporter from '@felte/reporter-tippy';
	import { validateSchema } from '@felte/validator-yup';
	import * as yup from 'yup';

	const registerSchema = yup.object({
		email: yup.string().email().required(),
		password1: yup.string().required().min(8, 'must be at least 8 characters long'),
		password2: yup
			.string()
			.required()
			.test('equal', 'Passwords do not match!', function (v) {
				const ref = yup.ref('password1');
				return v === this.resolve(ref);
			})
	});

	const { form, errors, touched, isValid, isSubmitting } = createForm<
		yup.InferType<typeof registerSchema>
	>({
		validate: validateSchema(registerSchema),
		onSubmit: async (values) => {
			const res = await fetch('/api/v1/users/register', {
				method: 'post',
				body: JSON.stringify({
					email: values.email,
					password: values.password1
				})
			});
			if (res.ok) {
				alert("Registered successfully!")
				window.location.replace("/")
			} else {
				alert("Error while registering")
			}
		}
	});
</script>

<div class="flex items-center justify-center h-screen px-4">
	<div>
		<div
			class="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800"
		>
			<div class="px-6 py-4">
				<h2 class="text-3xl font-bold text-center text-gray-700 dark:text-white">ImNote</h2>

				<h3 class="mt-1 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
					Nice to meet you!
				</h3>

				<p class="mt-1 text-center text-gray-500 dark:text-gray-400">Create account</p>

				<form use:form>
					<div class="w-full mt-4">
						<div class="dark:bg-gray-800 bg-white p-4 rounded-lg">
							<div class="relative bg-inherit w-full">
								<input
									id="email"
									name="email"
									type="email"
									class="w-full peer bg-transparent h-10 rounded-lg text-gray-700 dark:text-white placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
									placeholder="Email"
									class:ring-red-700={$errors.email !== null}
									class:ring-green-600={$touched.email === true &&
										$errors.email === null}
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
									id="password1"
									name="password1"
									type="password"
									class:ring-red-700={$errors.password1 !== null}
									class:ring-green-600={$touched.password1 === true &&
										$errors.password1 === null}
									class="w-full peer bg-transparent h-10 rounded-lg text-gray-700 dark:text-white placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
									placeholder="Password"
								/>
								<label
									for="password1"
									class="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
								>
									Password
								</label>
							</div>
						</div>
						<div class="dark:bg-gray-800 bg-white p-4 rounded-lg">
							<div class="relative bg-inherit w-full">
								<input
									id="password2"
									name="password2"
									type="password"
									class="w-full peer bg-transparent h-10 rounded-lg text-gray-700 dark:text-white placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
									placeholder="Password"
									class:ring-red-700={$errors.password2 !== null}
									class:ring-green-600={$touched.password2 === true &&
										$errors.password2 === null}
								/>
								<label
									for="password2"
									class="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
								>
									Password
								</label>
							</div>
						</div>

						<div class="flex items-center justify-between mt-4">
							<a
								href="/account/reset-password"
								class="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500"
								>Forgot Password?</a
							>

							<button
								class="px-4 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded hover:bg-gray-600 focus:outline-none"
								disabled={!$isValid || $isSubmitting}
								class:cursor-not-allowed={!$isValid || $isSubmitting}
								class:opacity-50={!$isValid || $isSubmitting}
								type="submit"
							>
								{#if $isSubmitting}
									<svg class="h-4 w-4 animate-spin" viewBox="3 3 18 18">
										<path
											class="fill-blue-800"
											d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
										/>
										<path
											class="fill-blue-100"
											d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
										/>
									</svg>
								{:else}
									Register
								{/if}
							</button>
						</div>
					</div>
				</form>
			</div>

			<div
				class="flex items-center justify-center py-4 text-center bg-gray-50 dark:bg-gray-700"
			>
				<span class="text-sm text-gray-600 dark:text-gray-200"
					>Already have an account?
				</span>

				<a
					href="/account/login"
					class="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline"
					>Login</a
				>
			</div>
		</div>
	</div>
</div>

