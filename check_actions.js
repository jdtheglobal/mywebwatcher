const https = require('https');

https.get({
    hostname: 'api.github.com',
    path: '/repos/jdtheglobal/mywebwatcher/actions/runs?per_page=3',
    headers: { 'User-Agent': 'Node.js' }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const runs = JSON.parse(data).workflow_runs;
        runs.forEach(r => {
            console.log(`Name: ${r.name}`);
            console.log(`Status: ${r.status}`);
            console.log(`Conclusion: ${r.conclusion}`);
            console.log(`Commit: ${r.head_commit.message}`);
            console.log(`URL: ${r.html_url}`);
            console.log('---');
        });
    });
}).on('error', console.error);
