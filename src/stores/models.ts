import { writable } from 'svelte/store'
import { apiClient } from '../lib/api/client'
import { toast } from '@jill64/svelte-toast'

interface Language {
	name: string
	languageId: string
}

interface Models {
	modelId: string
	name?: string
	canDoTTS?: boolean
	canDoVoiceConversion?: boolean
	tokenCostFactor?: number
	description?: string
	maxCharReqFreeUser?: number
	maxCharReqSubscribedUser?: number
	maximumTextLengthPerRequest?: number
	languages?: Language[]
}

export const models = writable<Models[]>([])
export const error = writable<string | null>(null)

export const fetchModels = async (): Promise<void> => {
	await toast.promise(
		(async () => {
			const res = await apiClient<Models[]>('/api/models')
			models.set(res.data)
			error.set(null)
		})(),
		{
			loading: 'Loading models...',
			success: 'Models fetched successfully',
			error: (err) => {
				const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred trying to fetch models'
				error.set(errorMessage)
				return errorMessage
			},
		},
	)
}
