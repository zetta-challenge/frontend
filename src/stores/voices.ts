import { writable } from 'svelte/store'
import { apiClient } from '../lib/api/client'
import { toast } from '@jill64/svelte-toast'

interface Voices {
	voiceId: string
	name: string
}
export enum RemoveBgNoise {
	True = 'true',
	False = 'false',
}

export const error = writable<string | null>(null)
export const voices = writable<Voices[]>([])
export const name = writable<string | null>(null)
export const files = writable<File | null>(null)
export const removeBackgroundNoise = writable<RemoveBgNoise | RemoveBgNoise.True>(RemoveBgNoise.True)
export const delVoiceId = writable<string | null>(null)
export const isFetching = writable<boolean>(false)

export const fetchVoices = async (): Promise<void> => {
	isFetching.set(true)
	await toast.promise(
		(async () => {
			const res = await apiClient<Voices[]>('/api/voices')
			voices.set(res.data)
			error.set(null)
		})(),
		{
			loading: 'Loading voices...',
			success: 'Voices fetched successfully',
			error: (err) => {
				const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred trying to fetch voices'
				error.set(errorMessage)
				return errorMessage
			},
		},
	)
	isFetching.set(false)
}

export const addVoice = async (files: File, name: string, removeBackgroundNoise: RemoveBgNoise): Promise<void> => {
	await toast.promise(
		(async () => {
			const formData = new FormData()
			formData.append('files', files)
			formData.append('name', name)
			formData.append('removeBackgroundNoise', removeBackgroundNoise.toString())

			await apiClient('/api/voices', {
				method: 'POST',
				data: formData,
			})
		})(),
		{
			loading: 'Creating a new voice...',
			success: 'Voice created successfully',
			error: (err) => (err instanceof Error ? `Failed to create voice: ${err.message}` : 'An unknown error occurred trying to create voice'),
		},
	)
}

export const delVoice = async (delVoiceId: string): Promise<void> => {
	await toast.promise(
		(async () => {
			await apiClient('/api/voices', {
				method: 'DELETE',
				data: JSON.stringify({
					voiceId: delVoiceId,
				}),
			})
		})(),
		{
			loading: 'Deleting voice...',
			success: 'Voice deleted successfully',
			error: (err) => (err instanceof Error ? `Failed to delete voice: ${err.message}` : 'An unknown error occurred trying to delete voice'),
		},
	)
}
