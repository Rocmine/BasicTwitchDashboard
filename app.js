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
const ClientID = "1lvh0n0oidy746dj9jl22t6xzbguo3";

function getFollowerCount(channelId) {
  const url = new URL('https://api.twitch.tv/helix/users/follows');
  url.searchParams.append('channel', channelId);  // Replace with desired channel ID
  const headers = new Headers({
    'Client-ID': ClientID // Replace with your Twitch API Client ID
  });

  fetch(url, { headers })
    .then(response => response.json())
    .then(data => {
      const followerCount = data.total;
      console.log(data);
      console.log(`Channel has ${followerCount} followers.`);
    })
    .catch(error => console.error(error));
}

// Log the values to the console
console.log('Viewers count:', viewersCount);
console.log('Subs count:', subsCount);
console.log('Follow count:', followCount);
console.log('Subs point:', subsPoint);
console.log('Session time:', sessionTime);
console.log('Bitrate:', bitrate);
getFollowerCount();

document.getElementById