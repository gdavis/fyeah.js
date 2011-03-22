
PREFIX = .
SRC_DIR = src
TEST_DIR = test
DIST_DIR = ${PREFIX}/dist
TOOLS_DIR = ${PREFIX}/tools
MINIFIER = ${TOOLS_DIR}/closure-compiler/compiler.jar

MODULES = ${SRC_DIR}/core.js

FY = ${DIST_DIR}/fyeah.js
FY_MIN = ${DIST_DIR}/fyeah.min.js

FY_VER = $(shell cat version.txt)
VER = sed "s/@VERSION/${FY_VER}/"

DATE = $(shell git log -1 --pretty=format:%ad)


all: clean fyeah min
	@echo "fyeah.js build complete"

${DIST_DIR}:
	@mkdir -p ${DIST_DIR}

${TOOLS_DIR}:
	@mkdir -p ${TOOLS_DIR}

fyeah: ${FY}

${FY}: ${MODULES} | ${DIST_DIR}
	@echo "Building" ${FY}
	@cat ${MODULES} | \
		sed 's/@DATE/'"${DATE}"'/' | \
		${VER} > ${FY};

min: ${FY_MIN}

${FY_MIN}: fyeah
	@echo "Minifying" ${FY_MIN}
	@java -jar ${MINIFIER} --js ${FY} --js_output_file ${FY_MIN} --summary_detail_level 3

test:
	@echo "The test task is not ready"

docs:
	@echo "The docs task is not ready"

bench:
	@open test/benchmark/index.html

clean:
	@echo "Removing:" ${DIST_DIR}
	@rm -rf ${DIST_DIR}


.PHONY: all fyeah min test docs bench clean

