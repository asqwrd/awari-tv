const request = require('request-promise');
const express = require('express');
const moment = require('moment');
const  ColorThief = require('@mariotacke/color-thief');
const Vibrant = require('node-vibrant')


const color_thief = new ColorThief();


const app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control");
  next();
});

app.get('/', (req, res) => res.send('Welcome'));


app.get('/api/search/shows', (req, res) => {
  console.log(req.query.q);
    request({
      method: 'GET',
      uri: `http://api.tvmaze.com/search/shows?q=${req.query.q}`,
    }).then((response)=>{
      //console.log(response);
      response = JSON.parse(response);
      const shows = response.reduce((acc,curr)=>{
        return [...acc,curr.show]
      },[])
      res.send(shows);
    })
});

app.get('/api/search/shows/full', (req, res) => {
    request({
      method: 'GET',
      uri: `http://api.tvmaze.com/search/shows?q=${req.query.q}`,
    }).then((response)=>{
      //console.log(response);
      response = JSON.parse(response);
      const shows = response.reduce((acc,curr)=>{
        return [...acc,curr.show]
      },[])
      const hour = moment().hour();
      let time_of_day = 'morning';
      let time_of_day_image = 'images/morning.jpg';
      switch (true){
        case hour >=4 && hour < 12:
          time_of_day = 'morning';
          time_of_day_image = 'images/morning.jpg'
          break;
        case hour >= 12 && hour < 17:
          time_of_day = 'midday';
          time_of_day_image = 'images/midday.jpg'
          break;
        case hour >= 18 && hour < 22:
          time_of_day = 'evening';
          time_of_day_image = 'images/evening.jpg'
          break;
        case hour >= 22 || (hour  >= 0 && hour < 4):
          time_of_day = 'latenight';
          time_of_day_image = 'images/latenight.jpg'
      }
      const searchProm = new Promise((resolve, reject)=>{
        resolve({shows,time_of_day});
      })
      const image = shows[0] && shows[0].image ? shows[0].image.original:time_of_day_image;
      return Promise.all([searchProm, Vibrant.from(image).getPalette()])

    }).then(response=>{
      res.send({...response[0],color:response[1]});
    })
});

app.get('/api/shows/:id', (req, res) => {
    request({
      method: 'GET',
      uri: `http://api.tvmaze.com/shows/${req.params.id}?embed[]=nextepisode&embed[]=episodes&embed[]=seasons`,
    }).then((response)=>{
      response = JSON.parse(response);
      const show = response;
      show.seasons = show._embedded.seasons;
      show.seasons.forEach(season=>{
        let episodes = show._embedded.episodes.filter((episode)=>{
          return episode.season == season.number;
        })
        season.episodes = episodes;
      })
      const showProm = new Promise((resolve,reject)=>{
          resolve(show);
      })
      return Promise.all([showProm, Vibrant.from(show.image.original).getPalette()])
    }).then((responses)=>{
        console.log(responses)
        const show = responses[0];
        const color = responses[1];
        res.send({show,color})
    })
});

app.get('/api/favorites/:id', (req, res) => {
    //redirect('http://api.tvmaze.com/shows/'+ req.params.id, res);
});

app.get('/api/schedule', (req, res) => {
    request({
      method: 'GET',
      uri: `http://api.tvmaze.com/schedule?country=US&date=${req.query.date}`,
    }).then((response)=>{
      response = JSON.parse(response);
      let shows = response;
      if(req.query.filter){
         shows = response.filter((res)=>{
          return res.airtime == req.query.filter
        })
      }
      let times = [];
      response.forEach((show)=>{
        let moment_time = moment(`${show.airdate}T${show.airtime}`).format('hh:mma');
        let isExist = times.some((item)=>item.value == show.airtime);
        if(!isExist){
          times.push({value:show.airtime,formatted:moment_time});
        }

      })
      const hour = moment().hour();
      let time_of_day = 'morning';
      let time_of_day_image = 'images/morning.jpg';
      switch (true){
        case hour >=4 && hour < 12:
          time_of_day = 'morning';
          time_of_day_image = 'images/morning.jpg'
          break;
        case hour >= 12 && hour < 17:
          time_of_day = 'midday';
          time_of_day_image = 'images/midday.jpg'
          break;
        case hour >= 18 && hour < 22:
          time_of_day = 'evening';
          time_of_day_image = 'images/evening.jpg'
          break;
        case hour >= 22 || (hour  >= 0 && hour < 4):
          time_of_day = 'latenight';
          time_of_day_image = 'images/latenight.jpg'
      }
      const scheduleProm = new Promise((resolve, reject)=>{
        resolve({shows,times,time_of_day});
      })
      const image = shows[0] && shows[0].show.image ? shows[0].show.image.original:time_of_day_image;
      return Promise.all([scheduleProm, Vibrant.from(image).getPalette()])

    }).then(responses =>{

      res.send({...responses[0],color:responses[1]});
    })
});


const server = app.listen(3002,'localhost',()=>{
  const host = server.address().address;
  const port = server.address().port;
  console.log(host);
});
