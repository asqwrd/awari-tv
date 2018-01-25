const request = require('request-promise');
const express = require('express');
const moment = require('moment');
const app = express();


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
      const group_shows = response.reduce((acc,curr,index)=>{
        if(acc[curr.airtime]){
          acc[curr.airtime] = [...acc[curr.airtime],curr];
        }else{
          acc[curr.airtime]=[curr];
        }
        return acc;
      },{});
      res.send(group_shows);

    })
});


const server = app.listen(3002,'localhost',()=>{
  const host = server.address().address;
  const port = server.address().port;
  console.log(host);
});
