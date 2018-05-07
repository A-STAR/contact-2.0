import { GeoPoint } from '../map-providers.interface';

export function toRad(x: number): number {
  return x * Math.PI / 180;
}

export function getLatLngDistance(start: GeoPoint, end: GeoPoint): number {
  const R = 6378137; // Earth’s mean radius in meter
  const dLat = toRad(end.lat - start.lat);
  const dLong = toRad(end.lng - start.lng);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(start.lat)) * Math.cos(end.lat) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

