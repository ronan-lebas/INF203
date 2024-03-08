#TP_NUM = 1
#ZIP_NAME = tpjs

TP_NUM = 2
ZIP_NAME = tphtml

TP_DIR = TP${TP_NUM}

zip:
	cd ${TP_DIR}/ && zip -r ../${ZIP_NAME}.zip . -x ".git/*" ".gitignore" "Makefile" "README.md" ".vscode/*" ".DS_Store" ".gitattributes" ".gitmodules" "node_modules/*" "*.json" "*.zip"	

clean:
	rm -rf *.zip