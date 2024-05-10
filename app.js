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

// Twitch authentication parameters
const client_id = "1lvh0n0oidy746dj9jl22t6xzbguo3";
const redirect_uri = "https://rocmine.github.io/BasicTwitchDashboard/dash";
const scope = "user:read:follows"; // Adjust scopes as needed

// Function to redirect user to Twitch authentication page
function authenticateWithTwitch() {
    const params = {
        client_id,
        redirect_uri,
        response_type: 'token', // Changed to 'token' for implicit grant flow
        scope
    };
    const queryString = new URLSearchParams(params).toString();
    const authorizationUrl = `https://id.twitch.tv/oauth2/authorize?${queryString}`;
    console.log("Authenticating with Twitch OAuth...");
    localStorage.setItem("Oauth", true);
    window.location.href = authorizationUrl;
}

// Function to handle Twitch authentication callback
function handleTwitchCallback() {
    // Parse access token from URL fragment
    const accessToken = new URLSearchParams(window.location.hash.substring(1)).get('access_token');
    const user = new URLSearchParams(window.location.hash.substring(1)).get('user_id');
    if (accessToken) {
        // Use the access token to make requests to the Twitch API
        fetch('https://api.twitch.tv/helix/streams', {
            headers: {
                'Client-ID': client_id,
                'Authorization': `Bearer ${accessToken}`
            }
        })
       .then(response => response.json())
       .then(data => {
            console.log(data); // Handle the Twitch API response here
        })
       .catch(error => console.error('Error:', error));
    }
}

window.onload = () => {
    if (localStorage.getItem("Oauth") == null) localStorage.setItem("Oauth", false);

    if (localStorage.getItem("Oauth") == "false") authenticateWithTwitch();
    else if (localStorage.getItem("Oauth") == "true") handleTwitchCallback();
}
