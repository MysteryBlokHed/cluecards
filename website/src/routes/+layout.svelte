<script lang="ts">
    import './layout.css';
    let { children } = $props();
</script>

<svelte:head>
    <title>Cluecards</title>
    <meta name="description" content="Automatic inference for interactions in Clue (Cluedo)." />
    <meta property="og:title" content="Cluecards" />
    <meta property="og:site_name" content="Cluecards" />
    <meta
        property="og:description"
        content="Automatic inference for interactions in Clue (Cluedo)."
    />
    <meta property="og:url" content="https://cluecards.adamts.me/" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://clue.adamts.me/images/icon-512.png" />
    <meta property="og:image:width" content="512" />
    <meta property="og:image:height" content="512" />

    <link rel="canonical" href="https://clue.adamts.me/" />
    <link rel="shortcut icon" href="/images/icon-192.png" type="image/png" />
    <link rel="apple-touch-icon" href="/images/icon-192.png" type="image/png" />
    <link rel="manifest" href="/manifest.json" />

    <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Icons&display=swap"
    />
</svelte:head>
{@render children()}
