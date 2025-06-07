import { get, writable } from 'svelte/store'
import { apiClient } from '../lib/api/client'
import { toast } from '@jill64/svelte-toast'
// import { env } from '../lib/api/environment'
import { env } from '$env/dynamic/public';


export enum ModelId {
	ElevenMonolingualV1 = 'eleven_monolingual_v1',
	ElevenMultilingualV1 = 'eleven_multilingual_v1',
	ElevenMultilingualV2 = 'eleven_multilingual_v2',
	ElevenTurboV2 = 'eleven_turbo_v2',
	ElevenFlashV2 = 'eleven_flash_v2',
	ElevenTurboV2_5 = 'eleven_turbo_v2_5',
	ElevenFlashV2_5 = 'eleven_flash_v2_5',
	ElevenEnglishStsV2 = 'eleven_english_sts_v2',
	ElevenMultilingualStsV2 = 'eleven_multilingual_sts_v2',
}
export enum OutputFormat {
	Mp32205032 = 'mp3_22050_32',
	Mp34410032 = 'mp3_44100_32',
	Mp34410064 = 'mp3_44100_64',
	Mp34410096 = 'mp3_44100_96',
	Mp344100128 = 'mp3_44100_128',
	Mp344100192 = 'mp3_44100_192',
	/* 	Pcm16000 = 'pcm_16000',
	Pcm22050 = 'pcm_22050',
	Pcm24000 = 'pcm_24000',
	Pcm44100 = 'pcm_44100',
	Ulaw8000 = 'ulaw_8000', */
}
export enum BodyTextToSpeechV1TextToSpeechVoiceIdPostApplyTextNormalization {
	Auto = 'auto',
	On = 'on',
	Off = 'off',
}
export interface VoiceSettings {
	stability?: number
	similarity_boost?: number
	style?: number
	use_speaker_boost?: boolean
}

export const voiceId = writable<string | null>(null)
export const text = writable<string | null>(null)
export const outputFormat = writable<OutputFormat | OutputFormat.Mp344100128>(OutputFormat.Mp344100128)
export const modelId = writable<ModelId | ModelId.ElevenMultilingualV2>(ModelId.ElevenMultilingualV2)
export const convertState = writable<number>(1)
export const isConverting = writable<boolean>(false)

export const convert = async (): Promise<Blob | null> => {
	isConverting.set(true)

	return await toast.promise(
		(async () => {
			try {
				const response = await apiClient<Blob>('/api/tts/convert', {
					method: 'POST',
					data: {
						voiceId: get(voiceId),
						text: get(text),
						outputFormat: get(outputFormat),
						modelId: get(modelId),
					},
					responseType: 'blob',
				})

				return response.data
			} catch (err: any) {
				if (err instanceof Error) {
					throw new Error(`Conversion failed: ${err.message}`)
				} else {
					throw err
				}
			} finally {
				isConverting.set(false)
			}
		})(),
		{
			loading: 'Converting text to speech...',
			success: 'Conversion completed successfully',
			error: (err) => (err instanceof Error ? err.message : 'An unknown error occurred trying to convert text-to-speech'),
		},
	)
}

export const convertAsStream = async (): Promise<Response | null> => {
	isConverting.set(true)

	return await toast.promise(
		(async () => {
			try {
				const response = await fetch(`${env.PUBLIC_API_URL}/api/tts/stream`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						voiceId: get(voiceId),
						text: get(text),
						outputFormat: get(outputFormat),
						modelId: get(modelId),
					}),
				})
				if (!response.ok) {
					throw new Error(response.statusText)
				}

				return response
			} catch (err: any) {
				if (err instanceof Error) {
					throw new Error(`Conversion failed: ${err.message}`)
				} else {
					throw err
				}
			} finally {
				isConverting.set(false)
			}
		})(),
		{
			loading: 'Converting text to speech as stream...',
			success: 'Conversion completed successfully',
			error: (err) => (err instanceof Error ? err.message : 'An unknown error occurred trying to convert text-to-speech as stream'),
		},
	)
}

// AXIOS FUNCTION NOT WORKING
//TODO Fix the live stream capability
/* export const convertAsStream = async (): Promise<Response | null> => {
	try {
		const axiosResponse = await apiClient<any>('/api/tts/stream', {
			method: 'POST',
			responseType: 'stream',
			data: {
				voiceId: get(voiceId),
				text: get(text),
				outputFormat: get(outputFormat),
				modelId: get(modelId),
			},
		})

		// Convert Axios response to fetch Response for compatibility with existing code
		const stream = new ReadableStream({
			start(controller) {
				axiosResponse.data.on('data', (chunk: Uint8Array) => {
					controller.enqueue(chunk)
				})

				axiosResponse.data.on('end', () => {
					controller.close()
				})

				axiosResponse.data.on('error', (err: Error) => {
					controller.error(err)
				})
			},
		})

		return new Response(stream)
	} catch (err: any) {
		toast.error(`Convert as Stream failed: ${err.message}`)
		if (err instanceof Error) {
			error.set(err.message)
		} else {
			error.set('An unknown error occurred during the text-to-speech conversion as stream.')
		}
		return null
	}
} */
