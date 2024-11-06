import { GPS } from '../interfaces/map';

// Function to simplify the path using the Douglas-Peucker algorithm
export const douglasPeucker = (points: GPS[], epsilon: number): GPS[] => {
	if (points.length < 3) return points;

	let dmax = 0;
	let index = 0;

	// Find the point with the maximum distance
	for (let i = 1; i < points.length - 1; i++) {
		const d = perpendicularDistance(points[i], points[0], points[points.length - 1]);
		if (d > dmax) {
			index = i;
			dmax = d;
		}
	}

	// If the max distance is greater than epsilon, recursively simplify the path
	if (dmax > epsilon) {
		const leftSegment = douglasPeucker(points.slice(0, index + 1), epsilon);
		const rightSegment = douglasPeucker(points.slice(index), epsilon);

		// Combine the results, avoiding duplicate points
		return leftSegment.slice(0, -1).concat(rightSegment);
	} else {
		// If the max distance is within the threshold, keep just the endpoints
		return [points[0], points[points.length - 1]];
	}
};

const perpendicularDistance = (point: GPS, start: GPS, end: GPS): number => {
	if (start.latitude === end.latitude && start.longitude === end.longitude) {
		return Math.hypot(point.latitude - start.latitude, point.longitude - start.longitude); // If the start and end points are the same
	}

	const numerator = Math.abs(
		(end.longitude - start.longitude) * point.latitude -
			(end.latitude - start.latitude) * point.longitude +
			end.latitude * start.longitude -
			end.longitude * start.latitude
	);
	const denominator = Math.hypot(end.longitude - start.longitude, end.latitude - start.latitude);
	return numerator / denominator;
};
