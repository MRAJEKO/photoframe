
cd ./source/photoframe

# REPO="https://github.com/MRAJEKO/photoframe.git"
# BRANCH="main"

# git pull $REPO_URL $BRANCH

npm i

npm run build

cp -r ./dist ../../deployment

# forever restartall
