<script lang="ts">
	import { onMount } from 'svelte'
	import { models, error, fetchModels } from '../../stores/models'
	import { derived, writable } from 'svelte/store'

	let searchQuery = writable<string>('')
	let expanded = new Set<string>()

	onMount(() => {
		fetchModels()
	})

	const filteredModels = derived([models, searchQuery], ([$models, $searchQuery]) => {
		const query = $searchQuery.toLowerCase()
		return $models
			.filter(({ modelId }) => modelId.toLowerCase().includes(query))
			.sort((a, b) => {
				const aIDMatch = a.modelId.toLowerCase().indexOf(query)
				const bIDMatch = b.modelId.toLowerCase().indexOf(query)
				return Math.min(aIDMatch) - Math.min(bIDMatch)
			})
	})

	function toggleExpand(modelId: string): void {
		const selection = window.getSelection()
		if (selection && selection.type === 'Range') {
			return
		}

		const element = document.getElementById(`content-${modelId}`)
		const container = document.getElementById(`container-${modelId}`)

		if (expanded.has(modelId)) {
			if (container) {
				container.style.maxHeight = '0px'
			}
			expanded.delete(modelId)
		} else {
			if (expanded.size) {
				const existingModelId = Array.from(expanded)[0]
				const existingContainer = document.getElementById(`container-${existingModelId}`)
				if (existingContainer) {
					existingContainer.style.maxHeight = '0px'
				}
				expanded.clear()
			}
			if (container && element) {
				container.style.maxHeight = `${element.scrollHeight}px`
			}
			expanded.add(modelId)
		}
		expanded = new Set(expanded)
	}
</script>

<svelte:head>
	<title>Models</title>
</svelte:head>

<div
	class="rounded-4xl relative mx-2 mb-2 min-h-screen px-8 pt-5 backdrop-blur-3xl backdrop-brightness-[67%] backdrop-contrast-100 dark:backdrop-brightness-[110%] dark:backdrop-contrast-125"
>
	<div class="mb-5 flex justify-center">
		<input
			type="text"
			class="models-search dark:bg-smoke dark:border-smoke w-1/3 rounded-xl border-zinc-900 bg-zinc-900 py-2 text-center text-white placeholder-slate-300"
			placeholder="Search models by name"
			bind:value={$searchQuery}
		/>
	</div>

	<div class="overflow-x-auto">
		{#if $error}
			<p class="mt-10 text-center text-2xl font-medium text-red-500">{$error}</p>
		{:else if $filteredModels.length > 0}
			<div class="mb-10">
				<ul>
					{#each $filteredModels as model}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
						<li
							class="bg-flash-white border-gwhite dark:bg-walpha57 dark:border-smoke mb-4 min-w-fit cursor-pointer rounded border p-5 text-lg"
							onclick={() => toggleExpand(model.modelId)}
						>
							<div class="flex items-center justify-between">
								<h2>{model.name} (<strong>{model.modelId}</strong>)</h2>
								<span class="pointer-events-none ml-4 select-none text-lg">
									{expanded.has(model.modelId) ? '▼' : '▲'}
								</span>
							</div>
							<div id={`container-${model.modelId}`} class="max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
								<div id={`content-${model.modelId}`} class="mt-2 pb-2">
									<p><strong>Description:</strong> {model.description}</p>
									<p><strong>Can Do TTS:</strong> {model.canDoTTS ? 'Yes' : 'No'}</p>
									<p><strong>Can Do Voice Conversion:</strong> {model.canDoVoiceConversion ? 'Yes' : 'No'}</p>
									<p><strong>Token Cost Factor:</strong> {model.tokenCostFactor}</p>
									<p><strong>Max Characters (Free User):</strong> {model.maxCharReqFreeUser}</p>
									<p><strong>Max Characters (Subscribed User):</strong> {model.maxCharReqSubscribedUser}</p>
									<p><strong>Maximum Text Length Per Request:</strong> {model.maximumTextLengthPerRequest}</p>
									<p><strong>Languages Supported:</strong></p>
									<ul>
										{#if model.languages}
											{#each model.languages as language}
												<li>{language.name} (<strong>{language.languageId}</strong>)</li>
											{/each}
										{/if}
									</ul>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{:else if !$models.length}
			<p class="mt-10 text-center text-2xl font-medium text-white">Loading models...</p>
		{:else}
			<p class="mt-10 text-center text-2xl font-medium text-white">No models found for your search query.</p>
		{/if}
	</div>
</div>

<style>
	input {
		transition: background-color 250ms ease;
	}
</style>
