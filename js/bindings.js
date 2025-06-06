// @ts-check

import createEmscripten from './squish.js';

const Module = await createEmscripten();

export const DxtFlags = {
	kDxt1: 1,
	kDxt3: 2,
	kDxt5: 4,
	kColourIterativeClusterFit: 256,
	kColourClusterFit: 8,
	kColourRangeFit: 16,
	kColourMetricPerceptual: 32,
	kColourMetricUniform: 64,
	kWeightColourByAlpha: 128,
};

/** @typedef {{ width: number; height: number; data: Uint8Array; }} RGBAImageData */
/** @typedef {RGBAImageData} DXTImageData */

/**
 * @param {Uint8Array} data 
 * @returns {number}
 */
function mallocAndSet(data) {
	const ptr = Module._malloc(data.length);
	Module.HEAPU8.set(data, ptr);
	return ptr;
}

/**
 * @param {number} ptr 
 * @param {number} length 
 * @returns {Uint8Array}
 */
function copyAndFree(ptr, length) {
	if (ptr === 0) throw Error('Tried to copy fom null pointer!');
	const arr = Module.HEAPU8.slice(ptr, ptr+length);
	Module._free(ptr);
	return arr;
}

/**
 * @param {RGBAImageData} image
 * @param {number} flags 
 * @returns {Uint8Array}
 */
export function CompressImage(image, flags) {
	// Check for error cases
	if (!(image.data instanceof Uint8Array)) throw Error('Expected image.data to be a Uint8Array!');
	if ((image.width % 4 || image.height % 4)) throw Error('Expected image width/height to be a multiple of 4!');
	const DATA_LENGTH = image.width * image.height * 4;
	if (DATA_LENGTH !== image.data.length) throw Error(`Expected image data to be of length ${DATA_LENGTH}!`);

	// Compress
	const ptrIn = mallocAndSet(image.data);
	const ptrOut = Module._CompressImage(ptrIn, image.width, image.height);
	const ptrOutLength = Module._GetStorageRequirements(image.width, image.height, flags);
	Module._free(ptrIn);
	return copyAndFree(ptrOut, ptrOutLength);
}

/**
 * @param {DXTImageData} image 
 * @param {number} flags 
 * @returns {Uint8Array}
 */
export function DecompressImage(image, flags) {
	// Check for error cases
	if (!(image.data instanceof Uint8Array)) throw Error('Expected image.data to be a Uint8Array!');
	if ((image.width % 4 || image.height % 4)) throw Error('Expected image width/height to be a multiple of 4!');
	const DATA_LENGTH = Module._GetStorageRequirements(image.width, image.height, flags);
	if (DATA_LENGTH !== image.data.length) throw Error(`Expected compressed data to be of length ${DATA_LENGTH}!`);
	
	// Decompress
	const ptrIn = mallocAndSet(image.data);
	const ptrOutLength = image.width * image.height * 4;
	const ptrOut = Module._DecompressImage(ptrIn, image.width, image.height);
	return copyAndFree(ptrOut, ptrOutLength);
}
