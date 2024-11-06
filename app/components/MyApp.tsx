'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GPS } from '../interfaces/map';
import { douglasPeucker } from '../utils/douglasPeucker';
import { bezierCurveSmoothing, catmullRomSpline } from '../utils/smoothCurve';
import { getArraySizeInBytes, getStringSizeInBytes } from '../utils/utils';
import MapRoute from './MapRoute';

type Inputs = {
	originalMap: string;
	epsilon: number;
};

const MyApp = () => {
	const [mapReduce, setMapReduced] = useState<GPS[]>([]);
	const [mapReducedCatmull, setMapReducedCatmull] = useState<GPS[]>([]);
	const [mapReduceBeizer, setMapReduceBeizer] = useState<GPS[]>([]);
	const { register, handleSubmit, watch } = useForm<Inputs>({
		defaultValues: {
			epsilon: 0.0001,
			originalMap: JSON.stringify([
				{ latitude: 51.505, longitude: -0.09 },
				{ latitude: 51.515, longitude: -0.1 },
				{ latitude: 51.525, longitude: -0.11 }
			])
		}
	});

	useEffect(() => {
		setMapReducedCatmull(catmullRomSpline(mapReduce));
		setMapReduceBeizer(bezierCurveSmoothing(mapReduce));
	}, [mapReduce]);

	const onSubmit = (data: Inputs) => {
		try {
			// console.log(data);
			const json = JSON.parse(data.originalMap);
			const newReduce = douglasPeucker(json, data.epsilon);
			setMapReduced(newReduce);

			// console.log(newMapData);
		} catch (ex) {
			console.error(ex);
		}
	};

	const originalMap = watch('originalMap');
	const epsilon = watch('epsilon');
	const originalPointCount = useMemo(() => {
		let count = 0;
		try {
			count = JSON.parse(originalMap).length;
		} catch (ex) {
			console.error(ex);
		}
		return count;
	}, [originalMap]);

	return (
		<div className="container">
			<form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
				<h1>Map Reducer Test (Douglas Peucker)</h1>
				<div>
					<label className="block text-gray-700 text-sm font-bold mb-2">Epsilon</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						type="decimal"
						{...register('epsilon')}
					/>
				</div>
				<div>
					<label className="block text-gray-700 text-sm font-bold mb-2">Original Map</label>
					<textarea
						{...register('originalMap')}
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					/>
				</div>
				<div>
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="submit"
					>
						Submit
					</button>
				</div>
			</form>
			<hr />
			<p>Epsilon: {epsilon}</p>
			<hr />
			<p>
				Original points: {originalPointCount?.toLocaleString()} (size:{' '}
				{getStringSizeInBytes(originalMap).toLocaleString()} bytes)
			</p>
			<p>
				New points (before catmull) {mapReduce.length.toLocaleString()} (size:{' '}
				{getArraySizeInBytes(mapReduce).toLocaleString()} bytes)
			</p>
			{mapReduce?.length > 0 ? <MapRoute points={mapReduce} /> : <div>No map data</div>}
			<hr />
			<p>
				New points (catmull smooth curve) {mapReducedCatmull.length.toLocaleString()} (size:{' '}
				{getArraySizeInBytes(mapReducedCatmull).toLocaleString()} bytes)
			</p>
			{mapReducedCatmull?.length > 0 ? <MapRoute points={mapReducedCatmull} /> : <div>No map data</div>}
			<hr />
			<p>
				New points (Beizer smooth curve) {mapReduceBeizer.length.toLocaleString()} (size:{' '}
				{getArraySizeInBytes(mapReduceBeizer).toLocaleString()} bytes)
			</p>
			{mapReduceBeizer?.length > 0 ? <MapRoute points={mapReduceBeizer} /> : <div>No map data</div>}
			<hr />
		</div>
	);
};

export default MyApp;
