FOLDERS := tpjs tphtml tpjs2 tpserver tpwebapp tpserver2
ZIP_FILES := $(addsuffix .zip,$(FOLDERS))

all: ${ZIP_FILES}

%.zip: %
	cd $< && zip -r ../$@ . -x ".git/*" ".gitignore" "Makefile" "README.md" ".vscode/*" ".DS_Store" ".gitattributes" ".gitmodules" "node_modules/*" "package.json" "package-lock.json" "*.zip"

clean:
	rm -rf ${ZIP_FILES}
