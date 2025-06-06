export declare interface RGBAImageData {
	width: number;
	height: number;
	data: Uint8Array;
}

export declare const DxtFlags = {
	/** Use DXT1 compression. */
	kDxt1: 1,
	/** Use DXT3 compression. */
	kDxt3: 2,
	/** Use DXT5 compression. */
	kDxt5: 4,
	/** Use a very slow but very high quality colour compressor. */
	kColourIterativeClusterFit: 256,
	/** Use a slow but high quality colour compressor (the default). */
	kColourClusterFit: 8,
	/** Use a fast but low quality colour compressor. */
	kColourRangeFit: 16,
	/** Use a perceptual metric for colour error (the default). */
	kColourMetricPerceptual: 32,
	/** Use a uniform metric for colour error. */
	kColourMetricUniform: 64,
	/** Weight the colour by alpha during cluster fit (disabled by default). */
	kWeightColourByAlpha: 128
} as const;

export declare interface DXTImageData extends RGBAImageData {
}

export declare function CompressImage(image: RGBAImageData, flags: number): Uint8Array;

export declare function DecompressImage(image: DXTImageData, flags: number): Uint8Array;
