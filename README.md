# FocusPro Documentation

Find the deployed version of FocusPro at: [focuspro.herokuapp.com](http://focuspro.herokuapp.com)

FocusPro runs on the following tech stack:
- Node.js
- Express
- React
- PostgreSQL


To set up local database (Mac):
1. Download and install Postgres.app.
2. Create config.js in server/config/ and insert the following (replace username with your username):
 module.exports = {
  'LOCAL_DATABASE_URL': 'postgres://username:@localhost:5432/username'
}
3. Follow the steps here: [Enable SSL in Postgres.app on Mac](http://blog.workherder.com/enable-ssl-in-the-postgres-app-on-mac-os-x/)

To use Chrome Extension:
1. Navigate to chrome://extensions on a Chrome tab.
2. Click 'Developer Mode' and then 'Load unpacked extension...'
2. Navigate to the extension folder and select it.

To start the application on a local machine:
1. Run 'npm install'.
2. Run 'npm install webpack -g'.
3. Run 'webpack --watch', 'npm start', and 'psql "sslmode=require"' on terminal tabs.

## Contributing
[Contribution guidelines for this project](CONTRIBUTING.md)

## Style Guide
[Style guidelines for this project](STYLE-GUIDE.md)