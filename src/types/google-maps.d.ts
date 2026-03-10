declare global {
  namespace google {
    namespace maps {
      class Map {
        constructor(mapDiv: HTMLElement, opts?: MapOptions);
        setCenter(latlng: LatLng | LatLngLiteral): void;
        setZoom(zoom: number): void;
        addListener(eventName: string, handler: Function): MapsEventListener;
      }

      class Marker {
        constructor(opts?: MarkerOptions);
        setPosition(latlng: LatLng | LatLngLiteral): void;
        addListener(eventName: string, handler: Function): MapsEventListener;
      }

      class Geocoder {
        geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: GeocoderStatus) => void): void;
      }

      interface MapOptions {
        center?: LatLng | LatLngLiteral;
        zoom?: number;
        mapTypeControl?: boolean;
        streetViewControl?: boolean;
        fullscreenControl?: boolean;
      }

      interface MarkerOptions {
        map?: Map;
        position?: LatLng | LatLngLiteral;
        draggable?: boolean;
        animation?: Animation;
      }

      interface GeocoderRequest {
        location?: LatLng | LatLngLiteral;
        address?: string;
      }

      interface GeocoderResult {
        formatted_address: string;
      }

      interface LatLng {
        lat(): number;
        lng(): number;
      }

      interface LatLngLiteral {
        lat: number;
        lng: number;
      }

      interface MapMouseEvent {
        latLng: LatLng | null;
      }

      interface MapsEventListener {
        remove(): void;
      }

      enum GeocoderStatus {
        OK = 'OK'
      }

      enum Animation {
        DROP = 'DROP'
      }
    }
  }
}

export {};
