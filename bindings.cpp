#include <emscripten/emscripten.h>
#include "libsquish/squish.h"

extern "C" {

	int GetStorageRequirements(int width, int height, int flags) {
		return squish::GetStorageRequirements(width, height, flags);
	}

	void* CompressImage(squish::u8* data, int width, int height, int flags) {
		int compLength = squish::GetStorageRequirements(width, height, flags);
		void* comp = malloc(compLength);
		squish::CompressImage(data, width, height, comp, flags);
		return comp;
	}

	squish::u8* DecompressImage(void* compressed, int width, int height, int flags) {
		squish::u8* output = (squish::u8*)malloc(width * height * 4);
		squish::DecompressImage(output, width, height, compressed, flags);
		return output;
	}

} // extern "C"