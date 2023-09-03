<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<div class="text-column">
	<h1>Charazard Image</h1>

	<p>
		{data.post.charazardImage}
		<img src="{data.post.charazardImage}"/>
	</p>

</div>
