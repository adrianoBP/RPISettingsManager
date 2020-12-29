# RPI Manager

Application to control and monitor some Raspbery PI features

## Requirements
- Raspberry PI 3 B+ (or greater) + Microphone
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

Config file (`additional.config`) located under `server`

```js
{
    "colorConfigs": {
        "COLOR_KEY#1": {
            "red": 50,
            "green": 50,
            "blue": 50
        },
        "COLOR_KEY#2": {
            "red": 128,
            "green": 64,
            "blue": 0
        }
        ...
    }
}
```

- **colorConfigs**: when saying a _COLOR_KEY_ with with Google Assitant, it will trigger an [IFTTT](https://ifttt.com/) applet to automatically change the colour of the leds with the selected configuration.

## Supported features
- Firebase Login
- [Control over ws2812b](#ws2812b-managment)
- Spotify Player (Work In Progress)

### ws2812b managment
##### Colour change: 
- Ability to change the whole LED-strip colour
- React to music
      
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)