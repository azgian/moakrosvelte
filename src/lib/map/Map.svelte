<script lang="ts">
  import { onMount } from 'svelte';
  import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';
  import { initLat, initLng, initZoom } from '$lib/gmap';
	import { goto } from '$app/navigation';

  let mapElement: HTMLElement;
  let map: google.maps.Map | null = null;
  let searchQuery = '';
  let mapTypeIndex = 0;
  let showTooltip = false;
  const mapTypes = ['satellite', 'terrain', 'roadmap'];
  const mapTypeLabels = ['위성', '지형', '일반'];
  const apiKey = PUBLIC_GOOGLE_MAPS_API_KEY;
  
  let currentPosition: google.maps.LatLngLiteral | null = null;
  let isMapLoaded = false;

  onMount(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onload = getUserLocation;
      document.head.appendChild(script);
    } else {
      getUserLocation();
    }
  });

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          currentPosition = { lat: latitude, lng: longitude };
          initMap(latitude, longitude);
        },
        error => {
          console.error("위치 정보를 가져오는데 실패했습니다:", error);
          initMap(); // 기본 위치로 지도 초기화
        }
      );
    } else {
      console.log("Geolocation을 지원하지 않는 브라우저입니다.");
      initMap(); // 기본 위치로 지도 초기화
    }
  }

  const initMap = (lat: number = initLat, lng: number = initLng) => {
    map = new google.maps.Map(mapElement, {
      center: { lat, lng },
      zoom: initZoom,
      mapTypeId: mapTypes[mapTypeIndex],
      gestureHandling: 'greedy',
      // 모든 기본 컨트롤 제거
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    });

    // 지도 로딩 완료 시 isMapLoaded를 true로 설정
    google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
      isMapLoaded = true;
    });

    // 현재 위치에 마커 추가 (my_location 아이콘 사용)
    new google.maps.Marker({
      position: { lat, lng },
      map: map,
      title: "현재 위치",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#4285F4",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      }
    });
  }

  const handleSearch = () => {
    console.log('검색어:', searchQuery);
    // 여기에 검색 로직을 구현하세요
  }

  const changeMapType = () => {
    mapTypeIndex = (mapTypeIndex + 1) % mapTypes.length;
    if (map) {
      map.setMapTypeId(mapTypes[mapTypeIndex]);
    }
    showTooltip = true;
    setTimeout(() => {
      showTooltip = false;
    }, 1000); // 2초 후 툴팁 숨김
  }

  const zoomSet = (zoom: number) => {
    if (map) {
      const currentZoom = map.getZoom();
      if (currentZoom !== undefined) {
        map.setZoom(currentZoom + zoom);
      }
    }
  }

  const moveToCurrentLocation = () => {
    if (map && currentPosition) {
      const duration = 250; // 500 밀리초로 줄임 (0.5초)
      const fps = 60;
      const frames = duration / (1000 / fps);
      
      const currentCenter = map.getCenter();
      const currentZoom = map.getZoom() || 0;
      const targetZoom = initZoom;
      
      let frame = 0;
      const animate = () => {
        if (frame >= frames) {
          if (map && currentPosition) {
            map.setCenter(currentPosition);
            map.setZoom(targetZoom);
          }
          return;
        }
        
        const progress = frame / frames;
        if (currentCenter && currentPosition) {
          const lat = currentCenter.lat() + (currentPosition.lat - currentCenter.lat()) * progress;
          const lng = currentCenter.lng() + (currentPosition.lng - currentCenter.lng()) * progress;
          const zoom = currentZoom + (targetZoom - currentZoom) * progress;
          
          if (map) {
            map.panTo({lat, lng});
            map.setZoom(zoom);
          }
        }
        frame++;
        
        requestAnimationFrame(animate);
      };
      
      animate();
    } else {
      getUserLocation();
    }
  }

  const handleAISearch = () => {
    console.log('AI 검색 실행');
    // 여기에 AI 검색 로직을 구현하세요
  }

</script>

<div class="map-container">
  <div class="search-container">
    <div class="search-form">
      <img src="/images/logo300.png" alt="로고" class="logo" />
      <input 
        type="text" 
        bind:value={searchQuery} 
        placeholder="지명, 인명 등 검색"
      />
      <button on:click={handleSearch} aria-label="검색">
        <span class="material-icons">search</span>
      </button>
    </div>
    <button on:click={handleAISearch} aria-label="AI 검색" class="map-control-button ai-button">
      <span>AI</span>
    </button>
  </div>
  <div class="map-controls-right">
    <button class="map-control-button user-button" on:click={()=>goto('/auth')} aria-label="Auth">
      <span class="material-icons">person_outline</span>
    </button>
    <button class="map-control-button map-type-toggle" on:click={changeMapType}>
      <span class="material-icons">layers</span>
      {#if showTooltip}
        <span class="tooltip">{mapTypeLabels[mapTypeIndex]}</span>
      {/if}
    </button>
    <button class="map-control-button" on:click={()=>zoomSet(1)} aria-label="확대">
      <span class="material-icons">add</span>
    </button>
    <button class="map-control-button" on:click={()=>zoomSet(-1)} aria-label="축소">
      <span class="material-icons">remove</span>
    </button>
    <button class="map-control-button" on:click={moveToCurrentLocation} aria-label="현재 위치로 이동">
      <span class="material-icons">my_location</span>
    </button>
  </div>
  <div class="map-controls-bottom">
    <button class="map-control-button" on:click={()=>{}} aria-label="지도 초기화">
      <span class="material-icons">pin_drop</span>
    </button>
  </div>
  <div bind:this={mapElement} class="map">
    {#if !isMapLoaded}
      <div class="skeleton-map">
        <div class="logo-container">
          <img src="/images/logo300.png" alt="로고" class="skeleton-logo" />
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .map-container {
    position: relative;
    width: 100%;
    height: 100vh;
  }

  .map {
    width: 100%;
    height: 100%;
  }

  .search-container {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    max-width: 600px;
    margin: 0 auto;
    z-index: 1000;
  }

  .search-form {
    flex: 1;
    min-width: 0;
    height: 60px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 0 10px;
    border-radius: 30px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
  }

  .logo {
    width: 40px;
    height: 40px;
    margin-right: 5px; /* 오른쪽 마진 추가 */
    object-fit: contain;
    flex-shrink: 0; /* 로고 크기 유지 */
  }

  .search-form input {
    flex-grow: 1;
    height: 100%;
    padding: 0 5px; /* 패딩을 줄임 */
    border: none;
    background: transparent;
    font-size: 1.05rem;
    outline: none;
    min-width: 0; /* 입력 필드가 줄어들 수 있도록 함 */
  }

  .search-form button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-left: 5px; /* 마진을 줄임 */
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0; /* 버튼 크기 유지 */
  }

  .search-form button .material-icons {
    font-size: 24px;
    color: var(--primary-color);
  }

  .ai-button {
    margin-left: 10px;
  }

  .ai-button span {
    font-weight: bold;
  }

  .map-controls-right {
    position: absolute;
    bottom: 80px;
    right: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    z-index: 1000;
  }

  .map-controls-bottom {
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    z-index: 1000;
  }

  .map-control-button {
    width: 60px;
    height: 60px;
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .map-control-button:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }

  .map-control-button .material-icons {
    font-size: 24px;
    color: var(--primary-color);
  }

  .map-type-toggle {
    position: relative; /* 툴팁 위치 지정을 위해 추가 */
  }

  .tooltip {
    position: absolute;
    top: -30px; /* 버튼 위로 툴팁 위치 */
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--primary-color);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    pointer-events: none;
    animation: fadeInOut 2s ease-in-out;
  }

  .tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--primary-color) transparent transparent transparent;
  }

  .user-button {
    background-color: #a8f894;
    margin-bottom: 30px;
  }

  .user-button .material-icons {
    font-size: 35px;
    color: var(--primary-color);
  }

  @keyframes fadeInOut {
    0%, 100% { opacity: 0; }
    10%, 90% { opacity: 1; }
  }

  /* 전역 스타일을 추가하여 지도 컨트롤이 검색 폼 위에 나타나지 않도록 합니다 */
  :global(.gm-style-cc),
  :global(.gmnoprint),
  :global(.gm-style-mtc) {
    display: none;
  }

  @media (max-width: 600px) {
    .search-container {
      max-width: 100%;
    }

    .search-form {
      height: 50px;
    }

    .logo {
      width: 30px;
      height: 30px;
    }

    .search-form button .material-icons {
      font-size: 20px;
    }
    .ai-button {
      margin-left: 5px;
    }
    .map-control-button {
      width: 50px;
      height: 50px;
    }

    .tooltip {
      font-size: 10px;
      padding: 3px 8px;
    }
  }

  .skeleton-map {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo-container {
    animation: pulse 2s infinite;
  }

  .skeleton-logo {
    width: 250px;
    height: 250px;
    opacity: 0.5;
    z-index: 1000;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.25);
      opacity: 0.7;
    }
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
  }
</style>