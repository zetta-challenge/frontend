<script lang="ts">
	let { createModal = $bindable(), deleteModal = $bindable(), header, children, footer } = $props()

	let dialog: HTMLDialogElement

	$effect(() => {
		if (createModal) {
			dialog.showModal()
		} else if (deleteModal) {
			dialog.showModal()
		} else if (dialog.open) {
			dialog.close()
		}
	})
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	class="top-half left-half bg-gwhite border-gwhite backdrop:bg-balpha4 dark:bg-night dark:border-smoke dark:backdrop:bg-balpha6 rounded-sm"
	bind:this={dialog}
	onclose={() => ((createModal = false), (deleteModal = false))}
	onclick={(e) => {
		if (e.target === dialog) dialog.close()
	}}
>
	<div class="p-4">
		{@render header?.()}
		{@render children?.()}
		{@render footer?.()}
	</div>
</dialog>

<style>
	dialog {
		transform: translate(-50%, -50%);
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: translate(-50%, -50%) scale(0.95);
		}
		to {
			transform: translate(-50%, -50%) scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
