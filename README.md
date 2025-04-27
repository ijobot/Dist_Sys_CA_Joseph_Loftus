# J&J Brick Shippers Smart Offices Control System
This system controls the climate, lighting, and security for the offices of J&J Brick Shippers.

## To run this project:
1) Open 4 terminal instances and path to the "server" directory (only 1 level down) in each one.
2) Run these 4 commands, one in each terminal instance:
    - node discoveryService.js
    - node climateService.js
    - node lightService.js
    - node securityService.js
3) Open a 5th terminal instance and path to the "client" directory (only 1 level down).
4) Run the command
    - node gui.js
5) Open a browser to localhost:3000
6) Add the following suffixes to the URL to navigate to various function pages:
    - /getLight
    - /setMultipleLights
    - /initiateClimateReadings
    - /securityClearance
7) To run functions in terminal instead of browser (needed for most functionality), use the 5th terminal window to run these commands:
    - node climateClient.js
    - node lightClient.js
    - node securityClient.js

## Discovery
**Unary functionality**

The discovery service handles all other services and manages the overall system.

This server **must** be running along with the others to allow the GUI to access functions.

## Climate
Server-streaming functionality.

The climate control system gets updated temperature and humidity readings every hour and then sets the internal climate controls to keep the office environment cool and comfortable.  It is an automated system that is triggered at 6am every morning and shuts off at 8pm.

Launching the climateClient will automatically start the weather reading emmisions.  

## Lighting
**Mix of unary, client-streaming, and server-streaming functions**

The light controls are user initiated and can be accessed by any employee that is granted permission.  Individual lights can be set, as well as all lights in a given location.  Both brightness and color can be changed for each bulb.

Launching the lightClient will automatically trigger the "mainMenu" function that allows users to call 1 of 5 options.  

When asked to enter a light ID for the "getLight", "setLight", and "setMultipleLights" functions, users can enter a number from 1-20.

When asked to choose a brightness and color for the "setLight" and "setMultipleLights" functions, users can enter a brightness number from 0-100 and any color string they want (there is no set list).

When asked to enter a location for the "getLocationLights" function, users can enter the following rooms: conference, office 1, office 2, entrance, hallway, or elevator.

## Security
**Bidirectional functionality**

The security system is a 2-way messaging portal that employees use to either enter the building in the morning, or to sign into the systems remotely.  Employees enter thier name first, then are asked to confirm their employee ID number, and finally are asked to give a secret code that changes monthly.
All messages back and forth and encrypted using a secretKey.

Launching the securityClient will automatically start the vetting process.

When responding to the 3 questions, users can use the following test data:
**name:** Kate Scott
**empNo:** 5555
**secret piece:** jumper plate

Entering any answer incorrectly will result in entry refusal by the system.  _More potential test data can be found at the top of the securityService.js file._