all:
	emcc									\
		-O2									\
		./bindings.cpp						\
		./libsquish/*.cpp					\
		-o ./js/squish.js					\
		-I libsquish/						\
		-sMALLOC=emmalloc					\
		-sMODULARIZE=1						\
		-sEXPORTED_RUNTIME_METHODS=HEAPU8	\
		-sEXPORTED_FUNCTIONS=_CompressImage,_DecompressImage,_GetStorageRequirements,_malloc,_free


# -sEXPORT_ES6=1						\
