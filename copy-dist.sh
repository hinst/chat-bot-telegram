mkdir -p dist
cp package.json ./dist/
cp package-lock.json ./dist/
cp -R compiled ./dist/
cp allowed-user-ids.json ./dist/
cp token.txt ./dist