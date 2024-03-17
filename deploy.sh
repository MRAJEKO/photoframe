forever stop server.js

# Remove any changes to the code locally
git reset --hard HEAD

git pull origin main --force

# Install app packages for the root
npm i

cd './controlpanel'

# Install all package for the control panel
npm i

npm run build

cd '..'

# Start forever in the root
forever start server.js
