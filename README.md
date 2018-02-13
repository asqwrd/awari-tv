# awari-tv
After working with Angular 2,4,5 ran into a lot of issues with the tv2 app, such as build size, inconsistancies with api calls not
working, and the app not loading on my phone for unknown reasons.  The new version of Angular feels cumbersome and I wanted to
rebuild the app with a lighter less opinionated framework. Since I had been working on another React Redux project I decided to
rebuild this in React Redux.  I added more features such as checking schedules on different days.  Better UX for selecting times
of days that way you dont have to scroll as much too find what shows are on at certain times.

Technologies Used:
React and Redux (create-react-redux boilerplate)
Sass
Nodejs for rest api
firebase
tvmaze for tv api (tvmaze.com/api)
React material for components

to run the app:
yarn install
yarn build
node server.js --port=[Any port you want to use]

to view the app go to
http://awaritv.ajibade.me
