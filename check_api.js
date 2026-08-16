const https = require('https');

https.get('https://ashy-river-04b7e4e00.7.azurestaticapps.net/api/sites', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Body: ${data}`);
    });
}).on('error', console.error);
