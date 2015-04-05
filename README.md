# OJ Box (Office Jukebox, or Orange Juice Box)

## What is OJ Box?
OJ Box is a poor man’s solution to having your own shareable music playlist.
It is targeted towards single room office or home settings. You can search for
songs, add them to a playlist, and vote on the songs in the playlist. No more
yelling across the room to have your buddy play you a song!

Try out the demo at http://ojbox.rocks.

## Installation
No more installation! I’m actually going to be hosting this at http://ojbox.rocks.
The project isn’t fully complete yet, but I’m working on it.

## How does it Work?
OJ Box is a web application that people can go to using a browser.

### Log In
Choose a user name and a box name. No password is required currently, although
I may add that in the future. The box name is so that you can share music with
only the people who are joined in to that particular box.

### The Player
It’s a media player with only three functions: a play/pause button, a button to
go back fifteen seconds, and a button to skip forward fifteen seconds. Since the
playlist is synced across everyone who is in that box, if the song ends, all playlists
on every client will get updated.

### Search
The Search tab is for adding music to the playlist. The music comes from
SoundCloud. OJ Box consumes the SoundCloud API. Thank you, SoundCloud!

### The Playlist
Songs added to the playlist can be viewed on the Playlist tab. Anyone logged in
can add songs to the playlist. If you are not the person who added the song,
you can vote up or down on it. Voting up or down can only be done once per user
per song. The person who added the song also has the permission to remove it
from the playlist.

### Chat
You can also chat with other logged in users on the Chat tab!

## Todo
- Add Spotify API support (this will require Spotify Premium)
- ~~Add user list on chat page~~
- Make it work for mobile. Phonegap
- Add Velocity and some animations
- Find other places to make performance boosts in the UI
- Add collection hooks
- Validate data
- Ability to toggle sound on/off from different clients
- Tutorial
- Splash page
- User accounts with authentication
- Ability to log out
- Ability to switch boxes
- Ability to search for boxes
- Settings tab
- Volume adjustment
- Make box names case-insensitive
- Make the chat channel a message channel including user joins/exits, song
  adds, and votes
- UI improvements on voting
- Test out the playlist changing when other people do it. Seems buggy
- Put speaker on the side of the orange juice box in the logo

## Possible future features
- Color theme
- Save chat history
- Database pruning, like delete users who haven’t logged on for a long time
- Gravatar for chat? and/or ability to upload image
- Settings page: settings include color theme, different modes, changing your
user name, setting your user picture, file location for local music files
- Either put in a list of connected users, or use the chat as a message log
and say when users connect, disconnect, etc.
- Import playlists from other services

## Notes
Of course there is a limit to how much the SoundCloud API will allow
streaming if this player becomes popular. Also, the YouTube API expressly
forbids just playing the audio from a video, so YouTube is no longer an
option (unless I show the whole video, but that’s beyond the scope of
the project for now).

If you have any questions or suggestions, please
email me.
