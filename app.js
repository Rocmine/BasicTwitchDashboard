// Select the elements
const viewersCountEl = document.querySelector('#viewers h1');
const subsCountEl = document.querySelector('#subs h1');
const followCountEl = document.querySelector('#follow h1');
const subsPointEl = document.querySelector('#subs_point h1');
const sessionTimeEl = document.querySelector('#session h1');
const bitrateEl = document.querySelector('#bitrate h1');

// Extract the text content
const viewersCount = viewersCountEl.textContent;
const subsCount = subsCountEl.textContent;
const followCount = followCountEl.textContent;
const subsPoint = subsPointEl.textContent;
const sessionTime = sessionTimeEl.textContent;
const bitrate = bitrateEl.textContent;

// Use the Twitch API to get the game title
const client_id = "1lvh0n0oidy746dj9jl22t6xzbguo3";

const express = require('express');
const fetch = require('node-fetch');
const querystring = require('querystring');

const app = express();

const redirect_uri = 'http://rocmine.github.io/BasicTwitchDashboard/dash';

// Step 1: Redirect the user to the Twitch authorization URL
app.get('/auth/twitch', (req, res) => {
  const params = {
    client_id,
    redirect_uri,
    response_type: 'code',
    scope: 'moderator:read:followers' // Add additional scopes as needed
  };

  const queryString = querystring.stringify(params);
  const authorizationUrl = `https://id.twitch.tv/oauth2/authorize?${queryString}`;

  res.redirect(authorizationUrl);
});

// Step 2: Handle the Twitch callback and exchange the authorization code for an access token
app.get('/auth/twitch/callback', async (req, res) => {
  const { code } = req.query;

  const params = {
    client_id,
    code,
    grant_type: 'authorization_code',
    redirect_uri
  };

  try {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: querystring.stringify(params)
    });

    const data = await response.json();
    const accessToken = data.access_token;

    // Now you have the access token, you can use it to make requests to the Twitch API
    res.send('Authentication successful! You can now make authenticated requests to the Twitch API.');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Authentication failed');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


// Log the values to the console
console.log('Viewers count:', viewersCount);
console.log('Subs count:', subsCount);
console.log('Follow count:', followCount);
console.log('Subs point:', subsPoint);
console.log('Session time:', sessionTime);
console.log('Bitrate:', bitrate);
getFollowerCount();