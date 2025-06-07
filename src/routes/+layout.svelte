<script lang="ts">
	import '../app.css'
	import Nav from '../components/Nav.svelte'
	import DarkMode from '../components/DarkMode.svelte'
	import { Toaster } from '@jill64/svelte-toast'

	let { children } = $props()
</script>

<div class="relative">
	<Nav />
	<DarkMode />
</div>
<div class="relative my-10 flex h-10 justify-center">
	<img class="h-10 dark:invert" src="./ElevenLabs-logo.png" alt="" />
</div>

<Toaster position="top-left" />
{@render children()}
