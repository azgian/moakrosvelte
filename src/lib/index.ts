import { Timestamp } from 'firebase/firestore';

export const convertToTimestamp = (date: unknown): Timestamp => {
    if (date instanceof Timestamp) {
        return date;
    }
    if (date instanceof Date) {
        return Timestamp.fromDate(date);
    }
    if (typeof date === 'number') {
        return new Timestamp(Math.floor(date / 1000), (date % 1000) * 1000000);
    }
    if (typeof date === 'string') {
        return Timestamp.fromDate(new Date(date));
    }
    throw new Error('Unknown date format');
};

export const formatDate = (date: unknown, format: string = ''): string => {
    if (!date) return '날짜 없음';
    
    const d = convertToTimestamp(date).toDate();
    
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const ymd = `${year}-${month}-${day}`;
    
    if (format === 'ymd') {
        return ymd;
    } else {
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const seconds = d.getSeconds().toString().padStart(2, '0');
        const time = `${hours}:${minutes}:${seconds}`;
        return `${ymd} ${time}`;
    }
};




/******
 * PWA 기능 주석처리 프로세스
 1. 서비스 워커 비활성화:
가장 중요한 단계입니다. 서비스 워커가 비활성화되면 캐싱 및 오프라인 기능이 중지됩니다.
src/service-worker.js 파일의 내용을 주석 처리하거나 삭제합니다.
2. manifest.webmanifest 파일 링크 제거:
PWA의 매니페스트 파일을 로드하지 않도록 합니다.
src/app.html 파일에서 <link rel="manifest" href="/manifest.webmanifest"> 줄을 주석 처리하거나 삭제합니다.
3. Vite PWA 플러그인 비활성화:
Vite PWA 플러그인을 사용 중이라면, 이를 비활성화하여 PWA 관련 빌드 작업을 중지합니다.
vite.config.js 파일에서 PWA 플러그인을 주석 처리하거나 삭제합니다.
4. 서비스 워커 등록 코드 제거:
서비스 워커를 등록하는 코드가 있다면 이를 주석 처리하거나 삭제합니다.
예를 들어, src/routes/__layout.svelte 파일이나 src/main.js 파일에 서비스 워커 등록 코드가 있을 수 있습니다.
각 단계의 중요성:
1단계는 필수입니다. 서비스 워커가 비활성화되면 PWA 기능이 중지됩니다.
2단계는 선택 사항입니다. 매니페스트 파일을 로드하지 않도록 하여 PWA 관련 설정을 무시할 수 있습니다.
3단계는 선택 사항입니다. Vite PWA 플러그인을 비활성화하여 빌드 시 PWA 관련 작업을 중지할 수 있습니다.
4단계는 선택 사항입니다. 서비스 워커 등록 코드를 제거하여 서비스 워커가 등록되지 않도록 할 수 있습니다.
따라서, 1단계만 수행해도 PWA 기능이 비활성화되지만, 2~4단계도 함께 수행하면 PWA 관련 모든 설정을 완전히 비활성화할 수 있습니다. 개발 중에는 1단계만 수행하고, 필요에 따라 2~4단계를 추가로 수행하는 것이 좋습니다.
 */