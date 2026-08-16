const https = require('https');

https.get('https://tad-func-mywebwatcher.azurewebsites.net', (res) => {
    console.log(`Status: ${res.statusCode}`);
}).on('error', console.error);
