<script lang="ts">
	import { onMount } from 'svelte'
	import {
		voices,
		error,
		fetchVoices,
		delVoice,
		delVoiceId,
		addVoice,
		name,
		files,
		removeBackgroundNoise,
		RemoveBgNoise,
		isFetching,
	} from '../stores/voices'
	import Modal from '../components/Modal.svelte'
	import { derived, get, writable } from 'svelte/store'

	const removeBgNoise = Object.values(RemoveBgNoise)
	let createModal = $state<boolean>(false)
	let deleteModal = $state<boolean>(false)
	let isExecuting = $state<boolean>(false)
	let searchQuery = writable<string>('')

	onMount(async () => {
		await fetchVoices()
	})

	const handleDelete = async (): Promise<void> => {
		isExecuting = true
		const voiceId = get(delVoiceId)

		if (voiceId) {
			try {
				await delVoice(voiceId)
			} finally {
				fetchVoices()
				deleteModal = false
				delVoiceId.set(null)
				isExecuting = false
			}
		}
	}

	const handleCreate = async (): Promise<void> => {
		isExecuting = true
		const addName = get(name)
		const addFiles = get(files)
		const addRemoveBgNoise = get(removeBackgroundNoise)

		if (addName && addFiles) {
			try {
				await addVoice(addFiles, addName, addRemoveBgNoise)
			} finally {
				fetchVoices()
				createModal = false
				name.set(null)
				files.set(null)
				removeBackgroundNoise.set(RemoveBgNoise.True)
				isExecuting = false
			}
		}
	}

	const handleFileChange = (event: Event): void => {
		const input = event.target as HTMLInputElement
		const file = input.files ? input.files[0] : null
		files.set(file)
	}

	const filteredVoices = derived([voices, searchQuery], ([$voices, $searchQuery]) => {
		const query = $searchQuery.toLowerCase()
		return $voices
			.filter(({ name }) => name.toLowerCase().includes(query))
			.sort((a, b) => {
				const aNameMatch = a.name.toLowerCase().indexOf(query)
				const bNameMatch = b.name.toLowerCase().indexOf(query)
				return Math.min(aNameMatch) - Math.min(bNameMatch)
			})
	})
</script>

<svelte:head>
	<title>ElevenLabs Tester</title>
</svelte:head>

<div
	class="rounded-4xl relative mx-2 mb-2 min-h-screen px-8 pt-5 text-white backdrop-blur-3xl backdrop-brightness-[67%] backdrop-contrast-100 dark:backdrop-brightness-[110%] dark:backdrop-contrast-125"
>
	<div class="mb-5 flex justify-center">
		<button class="create-voice mr-10 rounded-2xl bg-green-700 px-3 py-1 hover:bg-green-900" onclick={() => (createModal = true)}
			>Create a Voice</button
		>
		<input
			type="text"
			class="voices-search dark:bg-smoke dark:border-smoke w-1/3 rounded-xl border-zinc-900 bg-zinc-900 py-2 text-center text-white placeholder-slate-300"
			placeholder="Search voices by name"
			bind:value={$searchQuery}
		/>
		<button class="delete-voice ml-10 rounded-2xl bg-red-700 px-3 py-1 hover:bg-red-900" onclick={() => (deleteModal = true)}>Delete a Voice</button>
	</div>
	<div class="overflow-x-auto">
		{#if $error}
			<p class="mt-10 text-center text-2xl font-medium text-red-500">{$error}</p>
		{:else if $filteredVoices.length > 0}
			<table class="mb-8 min-w-full table-auto overflow-hidden rounded-xl">
				<thead class="bg-balpha79 dark:bg-walpha57 text-left text-gray-300 dark:text-black">
					<tr>
						<th class="border-payne-gray dark:border-smoke border-r px-4 py-3">#</th>
						<th class="border-payne-gray dark:border-smoke border-r px-3 py-3">Name</th>
						<th class="relative px-3 py-3">
							Voice ID
							<button
								class="refresh fill-gwhite absolute right-2 top-1 rounded-full bg-green-700 px-1 py-1 hover:bg-green-600 dark:bg-green-700 dark:fill-black dark:hover:bg-green-800"
								aria-label="Refresh"
								onclick={fetchVoices}
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" class="h-8 w-8 {$isFetching ? 'animate-spin' : ''}">
									<path
										d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"
									></path>
								</svg>
							</button>
						</th>
					</tr>
				</thead>
				<tbody>
					{#each $filteredVoices as { voiceId, name }, index}
						<tr class="even:bg-balpha7 dark:even:bg-walpha1 odd:bg-balpha6 dark:odd:bg-walpha2">
							<td class="border-payne-gray dark:border-smoke border-r px-4 py-2">{index + 1}</td>
							<td class="border-payne-gray dark:border-smoke border-r px-3 py-2">{name}</td>
							<td class="px-3 py-2">{voiceId}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else if !$voices.length}
			<p class="mt-10 text-center text-xl font-medium">Loading voices...</p>
		{:else}
			<p class="mt-10 text-center text-xl font-medium">No voices found for your search query.</p>
		{/if}
	</div>
</div>

<!-- Create Voice Modal -->
<Modal bind:createModal>
	{#snippet header()}
		<h2 class="relative -top-2 text-green-600">Create a Voice:</h2>
	{/snippet}

	<div class="content bg-metalic dark:bg-eerie-black dark:border-smoke flex w-80 flex-col gap-2 rounded-lg px-4 py-2">
		<div>
			<p class="mb-2 dark:text-white">Name your voice:</p>
			<input
				type="text"
				placeholder="Name"
				bind:value={$name}
				class="focus-within:bg-metalic dark:bg-smoke rounded border-none bg-white px-2 py-1 placeholder:text-black dark:text-white dark:placeholder:text-white dark:focus-within:bg-neutral-800"
			/>
		</div>
		<div>
			<p class="mb-2 dark:text-white">Remove Background Noise:</p>
			<select
				id="remove-noise-dropdown"
				class="focus-within:bg-metalic dark:bg-smoke cursor-pointer rounded border-none bg-white py-1 pr-10 placeholder:text-black dark:text-white dark:placeholder:text-white dark:focus-within:bg-neutral-800"
				bind:value={$removeBackgroundNoise}
			>
				{#each removeBgNoise as bool}
					<option value={bool}>{bool}</option>
				{/each}
			</select>
		</div>
		<div class="file-upload">
			<p class="mb-2 dark:text-white">Upload an audio sample:</p>
			<input class="my-2" type="file" hidden onchange={handleFileChange} accept="audio/*" id="file-upload" />
			<label
				for="file-upload"
				class="dark:bg-smoke relative top-2 cursor-pointer rounded bg-white px-4 py-2 text-black hover:bg-gray-300 aria-selected:bg-gray-300 dark:text-white dark:hover:bg-neutral-500 dark:aria-selected:bg-neutral-500"
				aria-selected={$files?.name != null ? true : false}>Choose File</label
			>
			{#if $files?.name != null}
				<p class="mt-5 text-lg text-black dark:text-white">{$files?.name}</p>
			{:else}
				<p class="mt-5 text-lg text-neutral-700 dark:text-neutral-300">No file selected</p>
			{/if}
		</div>
	</div>

	{#snippet footer()}
		<div class="relative">
			<p class="pt-4">
				<button
					class="disabled:bg-metalic dark:disabled:bg-eerie-black rounded-md bg-green-500 px-4 py-1 text-white hover:bg-green-700"
					onclick={handleCreate}
					disabled={!$files || !$name || isExecuting}>Create Voice</button
				>
				<button class="absolute right-0 rounded-md bg-violet-500 px-4 py-1 text-white hover:bg-violet-700" onclick={() => (createModal = false)}
					>Close</button
				>
			</p>
		</div>
	{/snippet}
</Modal>

<!-- Delete Voice Modal -->
<Modal bind:deleteModal>
	{#snippet header()}
		<h2 class="relative -top-2 text-red-500">Delete a voice</h2>
	{/snippet}

	<div class="content bg-metalic dark:bg-eerie-black rounded-lg p-4">
		<p class="relative -top-1 dark:text-white">Enter the Voice ID you want to delete:</p>
		<input
			type="text"
			placeholder="Voice ID"
			bind:value={$delVoiceId}
			class="focus-within:bg-metalic dark:bg-smoke mt-3 w-full rounded border-none bg-white py-1 placeholder:text-black dark:text-white dark:placeholder:text-white dark:focus-within:bg-neutral-800"
		/>
	</div>

	{#snippet footer()}
		<div class="relative">
			<p class="pt-4">
				<button
					class="disabled:bg-metalic dark:disabled:bg-eerie-black rounded-md bg-red-500 px-4 py-1 text-white hover:bg-red-700"
					onclick={handleDelete}
					disabled={!$delVoiceId || isExecuting}>Delete Voice</button
				>
				<button class="absolute right-0 rounded-md bg-violet-500 px-4 py-1 text-white hover:bg-violet-700" onclick={() => (deleteModal = false)}
					>Close</button
				>
			</p>
		</div>
	{/snippet}
</Modal>

<style>
	button:disabled {
		cursor: not-allowed;
	}
	button {
		cursor: pointer;
	}
	input,
	select,
	label {
		transition: background-color 250ms ease;
	}
</style>
