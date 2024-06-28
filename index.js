const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 31337;
const SECRET = process.env.GITHUB_WEBHOOK_SECRET || 'comedy';

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(bodyParser.json());

function validateGitHubSignature(req, res, next) {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) {
        return res.status(400).send('Signature missing');
    }

    const hmac = crypto.createHmac('sha256', SECRET);
    const digest = Buffer.from('sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex'), 'utf8');
    const checksum = Buffer.from(signature, 'utf8');

    if (!crypto.timingSafeEqual(digest, checksum)) {
        return res.status(401).send('Invalid signature');
    }

    next();
}

app.post('/github-webhook', validateGitHubSignature, (req, res) => {
    const event = req.headers['x-github-event'];
    const payload = req.body;

    console.log(`Received event: ${event}`);
    const commits = payload.commits;
    const pusher = payload.pusher;
    console.log(commits);
    console.log(pusher);
    res.status(200).send('Webhook received');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
