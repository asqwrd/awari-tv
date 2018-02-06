const request = require('request-promise');
const express = require('express');
const moment = require('moment');
const Vibrant = require('node-vibrant')
const firebase = require('firebase');
const admin = require('firebase-admin');

const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://awaritv-2b373.firebaseio.com"
});

const db = admin.database().ref();
const favorites = db.child('favorites');



const app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control");
  next();
});

const getShow = (id,addEmbed=true)=>{
  let embed = '';
  if(addEmbed)embed = '?embed[]=nextepisode&embed[]=episodes&embed[]=seasons'

  return request({
    method: 'GET',
    uri: `http://api.tvmaze.com/shows/${id}${embed}`,
    json: true,
    headers: {
        'User-Agent': 'Request-Promise'
    }
  }).then((response)=>{
    const show = response;
    if(!addEmbed){
      return new Promise((resolve, reject)=>{
        resolve(show);
      })
    }
    else{
      show.seasons = show._embedded.seasons;
      show.seasons.forEach(season=>{
        let episodes = show._embedded.episodes.filter((episode)=>{
          return episode.season == season.number;
        })
        season.episodes = episodes;
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
      const image = show && show.image ? show.image.original:time_of_day_image;
      const showProm = new Promise((resolve,reject)=>{
          resolve(show);
      })
      return Promise.all([showProm, Vibrant.from(image).getPalette()])
    }
  }).then((responses)=>{
      if(!addEmbed){
        return new Promise((resolve)=>{
          resolve({show:responses})
        })
      }
      const show = responses[0];
      const color = responses[1];
      return new Promise((resolve,reject)=>{
        resolve({show,color});
      })
  })
}

app.get('/', (req, res) => res.send('Welcome'));
app.get('/api/auth', (req,res)=>{
  admin.auth().verifyIdToken(req.query.token).then((decode)=>{
    console.log('auth')
    res.send('Success')
  })
})


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
  getShow(req.params.id).then(response =>{
    res.send(response);
  })
});

app.get('/api/favorites', (req, res) => {
    //redirect('http://api.tvmaze.com/shows/'+ req.params.id, res);
    if(req.query.user_id){
      allfavoritesPromise = [];
      favorites.once('value').then((snapshots)=>{
        snapshots.forEach((snap)=>{
          let key = snap.key;
          let val = snap.val();
          if(val.userid == req.query.user_id)
            allfavoritesPromise = [...allfavoritesPromise,getShow(val.showid,false)];
        })
        return Promise.all([...allfavoritesPromise]);
      }).then((responses)=>{
        const shows = responses.reduce((acc,curr)=>{
          return [...acc,curr.show];
        },[]);
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
        const showProm = new Promise((resolve, reject)=>{
          resolve(shows);
        })
        const time_of_dayProm = new Promise((resolve,reject)=>{
          resolve(time_of_day);
        })
        const image = shows[0].image && shows[0].image.original ? shows[0].image.original:time_of_day_image;
        return Promise.all([showProm,Vibrant.from(image).getPalette(),time_of_dayProm])

      }).then((responses)=>{
        const shows = responses[0];
        const color = responses[1];
        const time_of_day = responses[2];
        res.send({shows,color,time_of_day});
      })
    }else{
      res.send('Not logged in!');
    }


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
      if(req.query.user_id){
        return Promise.all([scheduleProm, Vibrant.from(image).getPalette(),favorites.once('value')])
      }
      return Promise.all([scheduleProm, Vibrant.from(image).getPalette()])

    }).then(responses =>{
      let allfavorites = [];
      if(responses[2]){
        snapshot = responses[2];
        snapshot.forEach((snap,index)=>{
          //let key = snapshot[index].getKey();
          let key = snap.key;
          let val = snap.val();
          if(val.userid == req.query.user_id)
            allfavorites = [...allfavorites,val.showid]
        })
      }
      const favorites = responses[0].shows.reduce((acc,curr) =>{
        if(allfavorites.indexOf(curr.show.id) >=0)
          return [...acc,curr];

        return [...acc];
      },[])

      res.send({...responses[0],color:responses[1], favorites});
    })
});


const server = app.listen(3002,'localhost',()=>{
  const host = server.address().address;
  const port = server.address().port;
  console.log(host);
});
