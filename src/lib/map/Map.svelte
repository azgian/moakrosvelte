<script lang="ts">
  import { onMount } from 'svelte';

  let mapElement: HTMLElement;
  let map: google.maps.Map | null = null;
  let searchQuery = '';
  let mapTypeIndex = 0;
  let showTooltip = false;
  const mapTypes = ['satellite', 'terrain', 'roadmap'];
  const mapTypeLabels = ['위성', '지형', '일반'];
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  let currentPosition: google.maps.LatLngLiteral | null = null;

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

  function getUserLocation() {
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

  function initMap(lat: number = 35.7215089, lng: number = 127.0184599) {
    map = new window.google.maps.Map(mapElement, {
      center: { lat, lng },
      zoom: 15,
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

  function handleSearch() {
    console.log('검색어:', searchQuery);
    // 여기에 검색 로직을 구현하세요
  }

  function changeMapType() {
    mapTypeIndex = (mapTypeIndex + 1) % mapTypes.length;
    if (map) {
      map.setMapTypeId(mapTypes[mapTypeIndex]);
    }
    showTooltip = true;
    setTimeout(() => {
      showTooltip = false;
    }, 1000); // 2초 후 툴팁 숨김
  }

  function zoomIn() {
    if (map) {
      const currentZoom = map.getZoom();
      if (currentZoom !== undefined) {
        map.setZoom(currentZoom + 1);
      }
    }
  }

  function zoomOut() {
    if (map) {
      const currentZoom = map.getZoom();
      if (currentZoom !== undefined) {
        map.setZoom(currentZoom - 1);
      }
    }
  }

  function moveToCurrentLocation() {
    if (map && currentPosition) {
      const duration = 250; // 500 밀리초로 줄임 (0.5초)
      const fps = 60;
      const frames = duration / (1000 / fps);
      
      const currentCenter = map.getCenter();
      const currentZoom = map.getZoom() || 0;
      const targetZoom = 15;
      
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

  function handleAISearch() {
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
        placeholder="장소를 검색하세요"
      />
      <button on:click={handleSearch} aria-label="검색" class="map-control-button">
        <span class="material-icons">search</span>
      </button>
    </div>
    <button on:click={handleAISearch} aria-label="AI 검색" class="map-control-button ai-button">
      <span>AI</span>
    </button>
  </div>
  <div class="map-controls">
    <button class="map-control-button map-type-toggle" on:click={changeMapType}>
      <span class="material-icons">layers</span>
      {#if showTooltip}
        <span class="tooltip">{mapTypeLabels[mapTypeIndex]}</span>
      {/if}
    </button>
    <button class="map-control-button zoom-button" on:click={zoomIn} aria-label="확대">
      <span class="material-icons">add</span>
    </button>
    <button class="map-control-button zoom-button" on:click={zoomOut} aria-label="축소">
      <span class="material-icons">remove</span>
    </button>
  </div>
  <div class="current-location-control">
    <button class="map-control-button current-location-button" on:click={moveToCurrentLocation} aria-label="현재 위치로 이동">
      <span class="material-icons">my_location</span>
    </button>
  </div>
  <div bind:this={mapElement} class="map"></div>
</div>

<style>
  :root {
    --primary-color: #2e6930; /* 녹색 계열 색상 */
    --primary-color-dark: #1c411e; /* 조금 더 어두운 녹색 */
  }

  .map-container {
    position: relative;
    width: 100%;
    height: 100vh;
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
    padding: 5px 10px; /* 패딩을 줄임 */
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
    height: 40px;
    padding: 0 5px; /* 패딩을 줄임 */
    border: none;
    background: transparent;
    font-size: 16px;
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

  .map-controls {
    position: absolute;
    bottom: 100px;
    right: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1000;
  }

  .map-type-toggle {
    position: relative; /* 툴팁 위치 지정을 위해 추가 */
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
    margin-bottom: 10px;
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

  /* 툴팁 화살표 추가 */
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

  @keyframes fadeInOut {
    0%, 100% { opacity: 0; }
    10%, 90% { opacity: 1; }
  }

  .zoom-button {
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
    margin-bottom: 10px;
  }

  .zoom-button:last-child {
    margin-bottom: 0;
  }

  .zoom-button:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }

  .zoom-button .material-icons {
    font-size: 24px;
    color: var(--primary-color);
  }

  .current-location-control {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
  }

  .current-location-button {
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

  .current-location-button:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }

  .current-location-button .material-icons {
    font-size: 24px;
    color: var(--primary-color);
  }

  .map {
    width: 100%;
    height: 100%;
  }

  /* 전역 스타일을 추가하여 지도 컨트롤이 검색 폼 위에 나타나지 않도록 합니다 */
  :global(.gm-style-cc),
  :global(.gmnoprint),
  :global(.gm-style-mtc) {
    display: none;
  }

  /* 모바일 화면에 대한 미디어 쿼리 추가 */
  @media (max-width: 600px) {
    .search-container {
      max-width: 100%;
    }

    .search-form {
      padding: 5px;
    }

    .logo {
      width: 30px;
      height: 30px;
    }

    .search-form input {
      font-size: 14px;
    }

    .search-form button .material-icons {
      font-size: 20px;
    }

    .map-controls {
      bottom: 80px;
      right: 10px;
    }

    .map-type-toggle,
    .zoom-button {
      width: 50px;
      height: 50px;
    }

    .tooltip {
      font-size: 10px;
      padding: 3px 8px;
    }
  }

  /* 공통 버튼 스타일 */
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

  /* 특정 버튼에 대한 추가 스타일 */
  .ai-button {
    margin-left: 10px;
  }

  .ai-button span {
    font-weight: bold;
  }

  .zoom-button {
    margin-bottom: 10px;
  }

  .zoom-button:last-child {
    margin-bottom: 0;
  }

  /* 모바일 화면에 대한 미디어 쿼리 */
  @media (max-width: 600px) {
    .map-control-button {
      width: 50px;
      height: 50px;
    }

    .map-control-button .material-icons {
      font-size: 20px;
    }

    .ai-button {
      margin-left: 5px;
    }
  }
</style>
