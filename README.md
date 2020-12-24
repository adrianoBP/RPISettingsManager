# RPI Manager

Application to control and monitor some Raspbery PI features

## Requirements
- Google accout (Firebase)
- Spotify Account

## Configuration

Config file (`site.config`) located under `site`

```js
{
  "FirebaseConfig": {
    "apiKey": "API_KEY",
    "authDomain": "PROJECT_ID.firebaseapp.com",
    "databaseURL": "https://PROJECT_ID.firebaseio.com",
    "projectId": "PROJECT_ID",
    "storageBucket": "PROJECT_ID.appspot.com",
    "messagingSenderId": "SENDER_ID",
    "appId": "APP_ID",
    "measurementId": "G-MEASUREMENT_ID"
  },
  "SpotifyConfig": {
        "ClientID": "CLIENT_ID",
        "ClientSecret": "CLIENT_SECRET"
    }
}
```

## Supported features
- Firebase Login
- [Control over ws2812b](#ws2812b-managment)
- Spotify Player (Work In Progress)

### ws2812b managment
##### Colour change: 
- Ability to change the whole LED-strip colour
- React to music (play, stop and pause)
      
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)