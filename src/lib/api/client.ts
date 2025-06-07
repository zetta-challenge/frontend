import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
// import { env } from './environment'
import { env } from '$env/dynamic/public';

export async function apiClient<T>(endpoint: string, options: Omit<AxiosRequestConfig, 'url'> = {}): Promise<AxiosResponse<T, any>> {
	const url = `${env.PUBLIC_API_URL}${endpoint}`

	const isFormData = options.data instanceof FormData

	const headers = isFormData ? { ...options.headers } : { 'Content-Type': 'application/json', ...options.headers }

	try {
		const response = await axios<any, AxiosResponse<T, any>>({
			url,
			...options,
			headers,
		})

		return response
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data?.message || error.response.statusText)
			} else {
				throw new Error(error.message)
			}
		}
		throw error
	}
}
