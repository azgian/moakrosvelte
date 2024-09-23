/**** service-worker.js 주석처리

/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

// 캐시 이름 정의
const CACHE_NAME = `cache-${version}`;

// 캐시할 파일 목록
const ASSETS = [...build, ...files];

// 서비스 워커 설치 시 실행되는 이벤트
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 서비스 워커 활성화 시 실행되는 이벤트
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 네트워크 요청 처리
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 캐시에서 찾으면 캐시된 응답 반환
      if (response) {
        return response;
      }

      // 캐시에 없으면 네트워크로 요청
      return fetch(event.request).then((response) => {
        // 유효한 응답이 아니면 그대로 반환
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // 응답을 클론하여 캐시에 저장
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// 푸시 알림 수신 처리
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: 'images/logo192.png',
    badge: 'images/badge.png'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 푸시 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.openWindow('/')
  );
});

/*****/