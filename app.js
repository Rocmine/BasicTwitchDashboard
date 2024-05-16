// Select the elements
const viewersCountEl = document.querySelector('#viewers h1');
const subsCountEl = document.querySelector('#subs h1');
const followCountEl = document.querySelector('#follow h1');
const subsPointEl = document.querySelector('#subs_point h1');
const sessionTimeEl = document.querySelector('#session h1');
const bitrateEl = document.querySelector('#bitrate h1');

const ttvChat = document.querySelector('#chatting');

// Twitch authentication parameters
const client_id = "1lvh0n0oidy746dj9jl22t6xzbguo3";
const redirect_uri = "https://rocmine.github.io/BasicTwitchDashboard/dash";
const scope = "user:read:follows"; // Adjust scopes as needed
const scopeSub = "channel:read:subscriptions";
let user_id=null;

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
    localStorage.setItem("token",accessToken);
    if (localStorage.getItem("token")) {
        // Use the access token to make requests to the Twitch API
        ttvChat.setAttribute("src",`https://www.twitch.tv/popout/${localStorage.getItem("user_id")}/chat`);
        fetchingInfo(client_id,localStorage.getItem("token"));
        fetchingInfoSubs(client_id,localStorage.getItem("token"));
        fetchingInfoFollow(client_id,localStorage.getItem("token"));
        changeURL(`BasicTwitchDashboard - ${localStorage.getItem("user_id")}` ,"dash");
        setInterval(() => {
            fetchingInfo(client_id,localStorage.getItem("token"));
            fetchingInfoSubs(client_id,localStorage.getItem("token"));
            fetchingInfoFollow(client_id,localStorage.getItem("token"));
        },30000);
    }
}

function fetchingInfo(cliid, jwttoken) {
    fetch(`https://api.twitch.tv/helix/streams?user_login=${localStorage.getItem("user_id")}`, {
        method: 'GET', // Changed method to GET
        headers: {
            'Client-ID': cliid,
            'Authorization': `Bearer ${jwttoken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(res => {
        console.log(res);
        if (res.data.length > 0) {
            sessionTimeEl.textContent = res.data[0].title;
            viewersCountEl.textContent = res.data[0].viewer_count;
            bitrateEl.textContent = res.data[0].game_name;
            localStorage.setItem("broadcasterid",res.data[0].id);
        } else {
            // Handle case when no streams are found
            sessionTimeEl.textContent = "No active stream";
            viewersCountEl.textContent = "0";
            bitrateEl.textContent = "N/A";
        }
    })
    .catch(error => console.error('Error:', error));
}

function fetchingInfoSubs(cliid, jwttoken) {
    fetch(`https://api.twitch.tv/helix/subs?broadcaster_id=${localStorage.getItem("broadcasterid")}`, {
        method: 'GET', // Changed method to GET
        headers: {
            'Client-ID': cliid,
            'Authorization': `Bearer ${jwttoken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(res => {
        console.log(res);
        if (res.data.length > 0) {
            subsPointEl.textContent = res.points;
            subsCountEl.textContent = res.total;
        }
    })
    .catch(error => console.error('Error:', error));
}

function fetchingInfoFollow(cliid, jwttoken) {
    fetch(`https://api.twitch.tv/helix/followers?broadcaster_id=${localStorage.getItem("broadcasterid")}`, {
        method: 'GET', // Changed method to GET
        headers: {
            'Client-ID': cliid,
            'Authorization': `Bearer ${jwttoken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(res => {
        console.log(res);
        if (res.data.length > 0) {
            followCountEl.textContent = res.total;
        }
    })
    .catch(error => console.error('Error:', error));
}

function getUser() {
    let person = prompt("Please enter your twitch channel username:","");
    localStorage.setItem("user_id",person);
}

function changeURL(title,page) {
    window.history.replaceState("Nah where are you going", title, `./${page}`);
}

window.onload = () => {
    if (localStorage.getItem("Oauth") == null) localStorage.setItem("Oauth", false);

    if (localStorage.getItem("Oauth") == "false") authenticateWithTwitch();
    else if (localStorage.getItem("Oauth") == "true") {
        if (!localStorage.getItem("user_id")) {getUser();}
        handleTwitchCallback();
    };
}



function clearDataChannel() {
    clearData();
    window.location.href = window.URL + "/BasicTwitchDashboard";
}

// ROCMINE
// Made with Love <3
// i love noura