/* eslint-disable @typescript-eslint/no-explicit-any */
export function getStringSizeInBytes(str: string): number {
	return new TextEncoder().encode(str).length;
}
export function getArraySizeInBytes(arr: any[]): number {
	return arr.reduce((acc, val) => acc + getStringSizeInBytes(JSON.stringify(val)), 0);
}
