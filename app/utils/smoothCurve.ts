import { GPS } from '../interfaces/map';

export function catmullRomSpline(points: GPS[], resolution: number = 10): GPS[] {
	const splinePoints = [];

	for (let i = 0; i < points.length - 3; i++) {
		const p0 = points[i];
		const p1 = points[i + 1];
		const p2 = points[i + 2];
		const p3 = points[i + 3];

		for (let j = 0; j < resolution; j++) {
			const t = j / resolution;
			const t2 = t * t;
			const t3 = t2 * t;

			const latitude =
				0.5 *
				(2 * p1.latitude +
					(-p0.latitude + p2.latitude) * t +
					(2 * p0.latitude - 5 * p1.latitude + 4 * p2.latitude - p3.latitude) * t2 +
					(-p0.latitude + 3 * p1.latitude - 3 * p2.latitude + p3.latitude) * t3);

			const longitude =
				0.5 *
				(2 * p1.longitude +
					(-p0.longitude + p2.longitude) * t +
					(2 * p0.longitude - 5 * p1.longitude + 4 * p2.longitude - p3.longitude) * t2 +
					(-p0.longitude + 3 * p1.longitude - 3 * p2.longitude + p3.longitude) * t3);

			splinePoints.push({ latitude, longitude });
		}
	}

	return splinePoints;
}

export function movingAverageSmoothing(points: GPS[], windowSize: number): GPS[] {
	const smoothedPoints = [];

	for (let i = 0; i < points.length; i++) {
		let sumLat = 0;
		let sumLng = 0;
		let count = 0;

		for (let j = i - windowSize; j <= i + windowSize; j++) {
			if (j >= 0 && j < points.length) {
				sumLat += points[j].latitude;
				sumLng += points[j].longitude;
				count++;
			}
		}

		smoothedPoints.push({
			latitude: sumLat / count,
			longitude: sumLng / count
		});
	}

	return smoothedPoints;
}

export function bezierCurveSmoothing(points: GPS[], resolution: number = 20): GPS[] {
	const smoothedPoints = [];

	for (let i = 0; i < points.length - 1; i++) {
		const p0 = points[i];
		const p1 = points[i + 1];

		// Calculate control points (midpoints or offsets based on surrounding points)
		const cp0 = {
			latitude: p0.latitude + (p1.latitude - p0.latitude) * 0.25,
			longitude: p0.longitude + (p1.longitude - p0.longitude) * 0.25
		};

		const cp1 = {
			latitude: p1.latitude - (p1.latitude - p0.latitude) * 0.25,
			longitude: p1.longitude - (p1.longitude - p0.longitude) * 0.25
		};

		// Generate points along the cubic Bezier curve
		for (let t = 0; t <= 1; t += 1 / resolution) {
			smoothedPoints.push(cubicBezier(p0, p1, cp0, cp1, t));
		}
	}

	return smoothedPoints;
}

function cubicBezier(p0: GPS, p1: GPS, cp0: GPS, cp1: GPS, t: number): GPS {
	const latitude =
		(1 - t) ** 3 * p0.latitude +
		3 * (1 - t) ** 2 * t * cp0.latitude +
		3 * (1 - t) * t ** 2 * cp1.latitude +
		t ** 3 * p1.latitude;

	const longitude =
		(1 - t) ** 3 * p0.longitude +
		3 * (1 - t) ** 2 * t * cp0.longitude +
		3 * (1 - t) * t ** 2 * cp1.longitude +
		t ** 3 * p1.longitude;

	return { latitude, longitude };
}
