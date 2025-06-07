import { json } from '@sveltejs/kit'

export const POST = async ({ request }) => {
	const body = await request.json()

	// Process the POST data
	console.log('Received POST data:', body)

	return json({ message: 'Data received successfully' })
}
