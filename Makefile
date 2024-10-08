${DST}: ${SRC}
ifeq "${TOOL}" "SVG"
	convert -background none ${SRC} ${DST}
endif
ifeq "${TOOL}" "IPE"
	iperender -png -resolution 200 -transparent ${SRC} ${DST}
endif

dev:
	./watch

fmt:
	pnpm exec prettier . --write

clean:
	rm -rf build
	rm -rf .soupault-cache

build:
	rm -rf .soupault-cache
	rm -rf build/main.js
	soupault --verbose

.PHONY: clean dev fmt build
