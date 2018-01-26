const request = require('request-promise');
const express = require('express');
const moment = require('moment');
const app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control");
  next();
});

app.get('/', (req, res) => res.send('Welcome'));


app.get('/api/search/shows', (req, res) => {
    request({
      method: 'GET',
      uri: `http://api.tvmaze.com/search/shows?q=${req.query.q}`,
    }).then((response)=>{
      response = JSON.parse(response);
      const shows = response.reduce((acc,curr)=>{
        return [...acc,curr.show]
      },[])
      res.send(shows);
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
      res.send(show);
    })
});

app.get('/api/favorites/:id', (req, res) => {
    //redirect('http://api.tvmaze.com/shows/'+ req.params.id, res);
});

app.get('/api/schedule', (req, res) => {
    request({
      method: 'GET',
      uri: 'http://api.tvmaze.com/schedule?country=US',
    }).then((response)=>{
      response = JSON.parse(response);
      const morning = response.filter((item,index)=>{
        let hour = moment(`${item.airdate}T${item.airtime}`).hour();
        return hour >=4 && hour < 12;
      });

      const midday = response.filter((item,index)=>{
        let hour = moment(`${item.airdate}T${item.airtime}`).hour();
        return hour >= 12 && hour < 17;
      });

      const evening = response.filter((item,index)=>{
        let hour = moment(`${item.airdate}T${item.airtime}`).hour();
        return hour >= 18 && hour < 22;
      });

      const latenight = response.filter((item,index)=>{
        let hour = moment(`${item.airdate}T${item.airtime}`).hour();
        return hour >= 22 || (hour  >= 0 && hour < 4);
      });

      res.send({morning,midday,evening,latenight});

    })
});


const server = app.listen(3002,'localhost',()=>{
  const host = server.address().address;
  const port = server.address().port;
  console.log(host);
});
