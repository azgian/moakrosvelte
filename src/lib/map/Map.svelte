<script lang="ts">
  import { onMount } from 'svelte';

  interface Window {
    google: typeof google;
    initMap: () => void;
  }

  let mapElement: HTMLElement;
  let map: google.maps.Map;
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  onMount(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  });

  function initMap() {
    map = new window.google.maps.Map(mapElement, {
      center: { lat: 35.7215089, lng: 127.0184599 }, // 금평호
      zoom: 15
    });
  }
</script>

<div bind:this={mapElement}></div>

<style>
  div {
    width: 100vw;
    height: 100vh;
  }
</style>
