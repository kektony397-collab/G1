
import { LocationPoint } from '../types';

/**
 * Calculates distance between two GPS coordinates in kilometers using the Haversine formula.
 */
function getDistanceFromLatLonInKm(p1: LocationPoint, p2: LocationPoint): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(p2.lat - p1.lat);
  const dLon = deg2rad(p2.lng - p1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(p1.lat)) * Math.cos(deg2rad(p2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Calculates the total distance of a path in kilometers.
 */
export function calculatePathDistance(path: LocationPoint[]): number {
  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    totalDistance += getDistanceFromLatLonInKm(path[i], path[i + 1]);
  }
  return totalDistance;
}

/**
 * Calculates the area of a polygon defined by GPS coordinates in square meters using the Shoelace formula.
 * This is an approximation as it treats the Earth as a flat surface.
 */
export function calculatePolygonArea(path: LocationPoint[]): number {
  if (path.length < 3) {
    return 0;
  }

  const earthRadius = 6378137; // meters

  let area = 0;
  const points = [...path, path[0]]; // Close the polygon

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    const x1 = p1.lng * Math.PI / 180 * earthRadius * Math.cos(p1.lat * Math.PI / 180);
    const y1 = p1.lat * Math.PI / 180 * earthRadius;
    const x2 = p2.lng * Math.PI / 180 * earthRadius * Math.cos(p2.lat * Math.PI / 180);
    const y2 = p2.lat * Math.PI / 180 * earthRadius;

    area += (x1 * y2 - x2 * y1);
  }

  return Math.abs(area / 2);
}
