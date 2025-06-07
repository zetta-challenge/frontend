<script lang="ts">
	import { writable } from 'svelte/store'
	import { convert, convertAsStream, convertState, isConverting, ModelId, modelId, outputFormat, OutputFormat, text, voiceId } from '../../stores/tts'
	import * as pdfjsLib from 'pdfjs-dist'
	import { onMount, tick } from 'svelte'
	import { toast } from '@jill64/svelte-toast'

	if (typeof window !== 'undefined') {
		pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.min.mjs'
	}

	let isAudioAvailable = $state(false)
	let audioData: Uint8Array[] = []
	let audioBlobUrl = writable<string | null>(null)
	let uploadToast = ''
	const outputFormats = Object.values(OutputFormat)
	const modelIds = Object.values(ModelId)

	onMount(() => {
		autoExpand()
	})

	async function playAudio(): Promise<void> {
		const audioElement: HTMLAudioElement | null = document.getElementById('convert') as HTMLAudioElement

		try {
			const audioBlob = await convert()
			if (audioBlob) {
				const audioUrl = URL.createObjectURL(audioBlob)
				audioElement.src = audioUrl
				if (audioUrl) {
					audioElement.play()
				}
				audioBlobUrl.set(audioUrl)
				isAudioAvailable = true
			}
		} catch (err) {
			if (err instanceof Error) {
				console.error('Error playing audio:', err.message)
			} else {
				console.error('Error playing audio:', err)
			}
		}
	}

	async function playAudioStream(): Promise<void> {
		const audioElement: HTMLAudioElement | null = document.getElementById('convert-stream') as HTMLAudioElement
		const mediaSource = new MediaSource()
		audioElement.src = URL.createObjectURL(mediaSource)

		mediaSource.addEventListener('sourceopen', async () => {
			try {
				const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg')
				const response = await convertAsStream()

				if (!response || !response.body) {
					console.error('No response body received')
					mediaSource.endOfStream()
					return
				}

				const reader = response.body.getReader() // Adjust getReader logic if backend sends metadata alongside audio data.
				let firstChunkAppended = false

				while (true) {
					const { done, value } = await reader.read()
					if (done) {
						mediaSource.endOfStream()
						break
					}

					if (value) {
						audioData.push(value) // Save chunks to state for later use
						sourceBuffer.appendBuffer(value)

						// Wait until the buffer is ready for the next chunk
						await new Promise<void>((resolve) => {
							sourceBuffer.addEventListener('updateend', () => resolve(), { once: true })
						})

						// Start playback on first chunk
						if (!firstChunkAppended) {
							audioElement.play()
							firstChunkAppended = true
						}
					}
				}
				saveAudio()
			} catch (err) {
				if (err instanceof Error) {
					console.error('Error streaming audio:', err.message)
				} else {
					console.error('Error streaming audio:', err)
				}
				mediaSource.endOfStream()
			}
		})
	}

	function saveAudio(): void {
		const audioBlob = new Blob(audioData, { type: 'audio/mpeg' })
		const blobUrl = URL.createObjectURL(audioBlob)
		audioBlobUrl.set(blobUrl)
		isAudioAvailable = true
		audioData = []
	}

	function downloadAudio(): void {
		if ($audioBlobUrl) {
			const link = document.createElement('a')
			link.href = $audioBlobUrl

			const utcDate = new Date()
			const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000)
			const timestamp = localDate.toISOString().replace(/[-]/g, '').replace(/[T]/g, '_').replace(/[:]/g, '').split('.')[0]

			link.download = `ELTester_${timestamp}.mp3`

			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		}
	}

	async function handleFileUpload(event: Event): Promise<void> {
		const input = event.target as HTMLInputElement

		try {
			const file = input.files ? input.files[0] : null

			if (!file) {
				throw new Error('No file selected for upload!')
			}

			const fileExtension = file.name.split('.').pop()?.toLowerCase()

			if (fileExtension === 'txt') {
				const textContent = await file.text()
				text.set(textContent)
				await tick()
				autoExpand()
			} else if (fileExtension === 'pdf') {
				const reader = new FileReader()
				await new Promise<void>((resolve, reject) => {
					reader.onload = async (e) => {
						try {
							const typedArray = new Uint8Array(e.target?.result as ArrayBuffer)
							const pdf = await pdfjsLib.getDocument(typedArray).promise
							let extractedText = ''

							for (let i = 1; i <= pdf.numPages; i++) {
								const page = await pdf.getPage(i)
								const textContent = await page.getTextContent()
								extractedText += textContent.items.map((item: any) => item.str).join(' ') + '\n'
							}

							text.set(extractedText)
							await tick()
							autoExpand()
							resolve()
						} catch (err) {
							reject(err)
						}
					}
					reader.readAsArrayBuffer(file)
				})
			} else {
				throw new Error('Only .txt and .pdf files are supported')
			}

			toast.success('File uploaded successfully!', { id: uploadToast })
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'An unknown error occurred while uploading the file', { id: uploadToast })
		}
	}

	function autoExpand(): void {
		const textarea = document.getElementById('text-input')
		if (textarea) {
			textarea.style.height = 'auto'
			textarea.style.height = `${Math.min(textarea.scrollHeight, 800)}px`
		}
	}
</script>

<svelte:head>
	<title>Text to Speech</title>
</svelte:head>

<div
	class="rounded-4xl relative mx-2 mb-2 min-h-screen px-8 pt-5 backdrop-blur-3xl backdrop-brightness-[67%] backdrop-contrast-100 dark:backdrop-brightness-[110%] dark:backdrop-contrast-125"
>
	<div class="mb-5 flex justify-center text-black dark:text-white">
		<button
			class="mx-5 h-10 min-w-40 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:bg-gray-200 aria-pressed:bg-white aria-pressed:hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:dark:bg-zinc-800 dark:aria-pressed:bg-zinc-600 dark:aria-pressed:hover:bg-zinc-700"
			aria-pressed={$convertState == 1 ? true : false}
			onclick={() => convertState.set(1)}
			disabled={$isConverting}
			>Convert
		</button>
		<button
			class="mx-5 h-10 min-w-40 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:bg-gray-200 aria-pressed:bg-white aria-pressed:hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:dark:bg-zinc-800 dark:aria-pressed:bg-zinc-600 dark:aria-pressed:hover:bg-zinc-700"
			aria-pressed={$convertState == 2 ? true : false}
			onclick={() => convertState.set(2)}
			disabled={$isConverting}
			>Convert As Stream
		</button>
	</div>

	<div class="bg-metalic rounded-2xl border border-transparent px-8 text-black dark:bg-zinc-900 dark:text-white">
		{#if $convertState == 1}
			<p class="my-2 text-center"><strong>Convert Text to Speech</strong></p>
		{:else}
			<p class="my-2 text-center"><strong>Convert Text to Speech As Stream</strong></p>
		{/if}

		<div>
			<div class="flex flex-wrap gap-5">
				<div>
					<label for="voice-id" class="mb-1 block">Enter the Voice ID:</label>
					<input
						type="text"
						id="voice-id"
						placeholder="Voice ID"
						bind:value={$voiceId}
						class="focus-within:bg-metalic dark:bg-smoke rounded border-none bg-white px-2 py-1 text-black placeholder:text-neutral-500 dark:text-white dark:placeholder:text-white dark:focus-within:bg-neutral-800"
					/>
				</div>

				<div>
					<label for="model-id-dropdown" class="mb-1 block">Choose a Model:</label>
					<select
						id="model-id-dropdown"
						class="focus-within:bg-metalic dark:bg-smoke cursor-pointer rounded border-none bg-white py-1 pr-10 text-black placeholder:text-neutral-500 dark:text-white dark:placeholder:text-white dark:focus-within:bg-neutral-800"
						bind:value={$modelId}
					>
						{#each modelIds as id}
							<option value={id}>{id}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="output-format-dropdown" class="mb-1 block">Choose Output Format:</label>
					<select
						id="output-format-dropdown"
						class="focus-within:bg-metalic dark:bg-smoke cursor-pointer rounded border-none bg-white py-1 pr-10 text-black placeholder:text-neutral-500 dark:text-white dark:placeholder:text-white dark:focus-within:bg-neutral-800"
						bind:value={$outputFormat}
					>
						{#each outputFormats as format}
							<option value={format}>{format}</option>
						{/each}
					</select>
				</div>
			</div>

			<label for="text-input" class="mb-1 mt-4 block">Enter your text:</label>
			<div class="textarea-container relative">
				<div class="upload-button absolute -top-12 right-0">
					<input
						type="file"
						accept=".txt, .pdf"
						class="hidden"
						id="file-upload"
						onclick={() => {
							toast.dismiss(uploadToast)
							uploadToast = toast.loading('Uploading file...')
						}}
						onchange={handleFileUpload}
						oncancel={() => toast.error('No file or the same file selected for upload!', { id: uploadToast })}
						disabled={$isConverting}
					/>
					<label
						for="file-upload"
						class="block cursor-pointer rounded-md bg-gray-300 px-4 py-2 text-black hover:bg-gray-400 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-500 {$isConverting
							? 'cursor-not-allowed '
							: ''}"
					>
						Upload File
					</label>
				</div>

				<textarea
					class="focus-within:bg-metalic dark:bg-smoke min-h-[200px] w-full resize-none rounded-lg border-none bg-white p-6 text-xl text-black placeholder:text-neutral-500 dark:text-white dark:placeholder:text-white dark:focus-within:bg-neutral-800"
					id="text-input"
					bind:value={$text}
					oninput={autoExpand}
					placeholder="Type something here..."
				></textarea>
				{#if $text}
					<div class="char-counter absolute bottom-2 right-2 text-black dark:text-white">{$text.length}</div>
				{/if}
			</div>
		</div>

		{#if $convertState == 1}
			<p class="text-center">Convert text to speech using our library of over 3,000 voices across 32 languages.</p>
		{:else}
			<p class="text-center">Convert text to speech in real-time using our library of over 3,000 voices across 32 languages.</p>
		{/if}

		<div class="mt-4 flex flex-wrap gap-4">
			{#if $convertState == 1}
				<button
					class="convert disabled:bg-balpha2 dark:disabled:bg-walpha3 rounded-2xl bg-white px-4 py-2 hover:bg-gray-400 disabled:opacity-30 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-500"
					onclick={playAudio}
					disabled={!$voiceId || !$text || $isConverting}>Generate Speech</button
				>
			{:else}
				<button
					class="convertStream disabled:bg-balpha2 dark:disabled:bg-walpha3 rounded-2xl bg-white px-4 py-2 hover:bg-gray-400 disabled:opacity-30 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-500"
					onclick={playAudioStream}
					disabled={!$voiceId || !$text || $isConverting}>Generate Speech</button
				>
			{/if}

			<button
				class="download disabled:bg-balpha2 dark:disabled:bg-walpha3 rounded-2xl bg-white px-4 py-2 hover:bg-gray-400 disabled:opacity-30 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-500"
				onclick={downloadAudio}
				disabled={!isAudioAvailable}>Download Audio</button
			>
		</div>

		<div class="flex justify-center">
			{#if $convertState == 1}
				<audio id="convert" class="my-5 w-full max-w-md" controls></audio>
			{:else}
				<audio id="convert-stream" class="my-5 w-full max-w-md" controls></audio>
			{/if}
		</div>
	</div>
</div>

<style>
	button {
		cursor: pointer;
	}
	button:disabled {
		cursor: not-allowed;
	}
</style>
