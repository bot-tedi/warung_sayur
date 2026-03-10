'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapsProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLocation?: { lat: number; lng: number };
}

export default function GoogleMaps({ onLocationSelect, initialLocation }: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: initialLocation || { lat: -6.2088, lng: 106.8456 },
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      const markerInstance = new google.maps.Marker({
        map: mapInstance,
        draggable: true,
        animation: google.maps.Animation.DROP,
      });

      if (initialLocation) {
        markerInstance.setPosition(initialLocation);
      }

      mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
        const position = e.latLng;
        if (position) {
          markerInstance.setPosition(position);
          getAddressFromCoordinates(position.lat(), position.lng());
        }
      });

      markerInstance.addListener('dragend', (e: google.maps.MapMouseEvent) => {
        const position = e.latLng;
        if (position) {
          getAddressFromCoordinates(position.lat(), position.lng());
        }
      });

      setMap(mapInstance);
      setMarker(markerInstance);
      setLoading(false);
    }).catch((err) => {
      setError('Failed to load Google Maps. Please check your API key.');
      setLoading(false);
    });
  }, [initialLocation]);

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const address = results[0].formatted_address;
        onLocationSelect(lat, lng, address);
      } else {
        onLocationSelect(lat, lng, `Lat: ${lat}, Lng: ${lng}`);
      }
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (map && marker) {
            map.setCenter({ lat: latitude, lng: longitude });
            marker.setPosition({ lat: latitude, lng: longitude });
            getAddressFromCoordinates(latitude, longitude);
          }
        },
        (error) => {
          setError('Unable to get your location. Please select manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  if (loading) {
    return (
      <div className="map-container bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-container bg-gray-100 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={getCurrentLocation}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          📍 Use My Location
        </button>
        <p className="text-sm text-gray-600 flex items-center">
          Click on the map or drag the marker to select location
        </p>
      </div>
      <div ref={mapRef} className="map-container" />
    </div>
  );
}
