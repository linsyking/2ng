${DST}: ${SRC}
ifeq "${TOOL}" "SVG"
	convert -background none ${SRC} ${DST}
endif
ifeq "${TOOL}" "IPE"
	iperender -png -resolution 200 -transparent ${SRC} ${DST}
endif

dev:
	./watch

clean:
	rm -rf build
	rm -rf .soupault-cache

.PHONY: clean
