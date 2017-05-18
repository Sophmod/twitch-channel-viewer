const clientID = '';
const twitchChannels = [
        {username: 'esl_sc2', id: '30220059'},
        {username: 'OgamingSC2', id: '71852806'},
        {username: 'freecodecamp', id: '79776140'}
    ];
const channelRows = [
    {id: 'rowOne'},
    {id: 'rowTwo'},
    {id: 'rowThree'}
];

let isOnlineSelected = false;

document.addEventListener("DOMContentLoaded", () => {
    for (let channels in twitchChannels) {
	let httpRequest = new XMLHttpRequest();
	
    httpRequest.open('GET', 'https://api.twitch.tv/kraken/streams/' + twitchChannels[channels].id, true);

    httpRequest.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
    httpRequest.setRequestHeader('Client-ID', clientID); 

    httpRequest.onload = function () {
        if (this.readyState === 4) {
                let data = JSON.parse(this.responseText);
                console.log(data);
                let row = document.getElementById(channelRows[channels].id);
                if (data.stream != null) {
                    row.innerHTML = '<div></div>' + data.stream.channel.display_name  + ' | ' + data.stream.game + ' | <a href="' + data.stream.channel.url + '" target="_blank">Go now!</a>';
                    row.firstElementChild.classList.add('is-online');
                } else {
                    row.innerHTML = '<div></div>' + twitchChannels[channels].username + ' is not online.';
                    row.firstElementChild.classList.add('is-offline');
                }
            };
        };

	httpRequest.send(); 
    };
});

$('#submit-button').click(() => {
    findTwitchUser($('#user-input').val());
});

$('#show-online').click(() => {
    if (isOnlineSelected === false) {
        isOnline();
        $('#show-online').html('Show All');
    } else {
        showAll();
        $('#show-online').html('<div class="is-online"></div>Show Online')
    }
    isOnlineSelected = !isOnlineSelected;
})

function findTwitchUser(user) {
    let httpRequest = new XMLHttpRequest();

    httpRequest.open('GET', 'https://api.twitch.tv/kraken/users?login=' + user);

    httpRequest.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
    httpRequest.setRequestHeader('Client-ID', clientID);

    httpRequest.onload = function()  {
        if (this.readyState === 4) {
            let data = JSON.parse(this.responseText);
            if (data._total === 0) {
                alert('User not found, sorry!');
            } else {
              addTwitchUser(data.users[0].display_name, data.users[0]._id);  
            }
            
        }
    }
    httpRequest.send();
}


function addTwitchUser(username, userID) {
    let rowCounter = 4;
    let nextRequest = new XMLHttpRequest();

    nextRequest.open('GET', 'https://api.twitch.tv/kraken/streams/' + userID, true);

    nextRequest.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
    nextRequest.setRequestHeader('Client-ID', clientID);

    nextRequest.onload = function() {
        if (this.readyState === 4) {
            let appView = document.getElementById('app-view');
            let data = JSON.parse(this.responseText);
            console.log(data);
            
            if (data.stream != null) {
                $('#app-view').append('<div class="twitch-user-row"><div></div>' + data.stream.channel.display_name  + ' | ' + data.stream.game + ' | <a href="' + data.stream.channel.url + '" target="_blank">Go now!</a></div>');
                appView.lastChild.firstElementChild.classList.add('is-online');
            } else {
                $('#app-view').append('<div class="twitch-user-row"><div></div>' + username + ' is not online.');
                appView.lastChild.firstElementChild.classList.add('is-offline');
            }
            rowCounter++;
        }
    }
    nextRequest.send();
};

function isOnline() {
    let arr = $('#app-view').children();

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].firstElementChild.className == 'is-offline') {
            arr[i].classList.add('is-hidden');
        } 
    };
};

function showAll() {
    let arr = $('#app-view').children();

    for (let i = 0; i < arr.length; i++) {
        /* Following is not supported in browsers < IE 9 */
        if (arr[i].classList.contains('is-hidden')) {
            arr[i].classList.remove('is-hidden');
        }
    };
};