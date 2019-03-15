# windowSensor

This is a nodejs script that interfaces Honeywell alarm sensors into SmartThings.  This assumes you have an RTLSDR attached to your system.

## Installation

- Install the JSON complete API into the SmartThings IDE.  Note the installation ID and access tokens.
https://github.com/pdlove/homebridge-smartthings/tree/master/smartapps/pdlove/json-complete-api.src
- Create virtual contact sensors & motion sensors in the SmartThings IDE. Make sure to give the SmartApp access to them.
- Git clone this repo, fill in the installation ID and access token into windowSensor.js
- Run `npm install`
- Run ./windowSensor.sh



