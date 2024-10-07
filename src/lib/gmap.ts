// import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';
export const initLat = 35.7217627;
export const initLng = 127.0182769;
export const initZoom = 15;

export interface Themes
{
    title: string;
    userId: string;
    maps: Maps[];
}
export interface Maps {
    pos: {
        lat: number;
        lng: number;
    }
    userId: string;
}


    // zoom: number;
    // mapType: string;
    // mapTypeId: string;
    // mapTypeControl: boolean;
    // scaleControl: boolean;
    // streetViewControl: boolean;
    // rotateControl: boolean;
    // fullscreenControl: boolean;
    // zoomControl: boolean;
    // zoomControlOptions: {
    //     position: number;
    // }
    // mapTypeControlOptions: {
    //     style: number;
    //     position: number;
    // }
    // scaleControlOptions: {
    //     position: number;
    // }
    // fullscreenControlOptions: {
    //     position: number;
    // }
    // rotateControlOptions: {
    //     position: number;
    // }
    // streetViewControlOptions: {
    //     position: number;
    // }
    // mapOptions: {
    //     center: {
    //         lat: number;
    //         lng: number;
    //     }
    //     zoom: number;
    //     mapTypeId: string;
    //     mapTypeControl: boolean;
    // }
