import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

interface MapProps {
	points: { latitude: number; longitude: number }[];
}

const Map: React.FC<MapProps> = ({ points }) => {
	const mapRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!mapRef.current || points.length < 2) return; // At least two points are needed to draw a route

		// Initialize the map and set the view to the first point
		const map = L.map(mapRef.current).setView([points[0].latitude, points[0].longitude], 13);

		// Add the tile layer from OpenStreetMap
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		// Create an array of latLngs to be used in the polyline
		const latLngs = points.map((point) => [point.latitude, point.longitude] as [number, number]);

		// Draw the polyline to connect the points
		const polyline = L.polyline(latLngs, { color: 'blue', weight: 4 }).addTo(map);

		// Adjust map bounds to fit the entire route
		map.fitBounds(polyline.getBounds());

		return () => {
			map.remove(); // Clean up on component unmount
		};
	}, [points]);

	return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

export default Map;
