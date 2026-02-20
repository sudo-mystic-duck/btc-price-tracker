<script lang="ts">
	import { onMount } from 'svelte';

	async function fetchPrice() {
		const response = await fetch('http://localhost:3000/');
		const data = await response.json();
		console.log(data);

		return;
	}

	onMount(() => {
		fetchPrice();
	});
</script>
