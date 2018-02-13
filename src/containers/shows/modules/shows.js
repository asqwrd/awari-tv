import { auth } from '../../../firebase.js';

export const GET_SHOW = 'GET_SHOW'
export const GET_SEASON = 'GET_SEASON'
export const LOADING_API = 'LOADING_API'
export const ADD_FAVORITE_SHOW = 'ADD_FAVORITE'
export const REMOVE_FAVORITE_SHOW = 'REMOVE_FAVORITE_SHOW'


const SHOW_API = `//${window.location.hostname}:${window.location.port}/api/shows`;
const SHOW_FAVORITES_API = `//${window.location.hostname}:${window.location.port}/api/favorites`;

const initialState = {
  show: {image:{original:''},seasons:[],name:'', _embedded:{episodes:[]}},
  active_season:{},
  color:[255,255,255],
  mute_color:[255,255,255],
  loading:false,
  episodes:[]
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SHOW:
      return {
        ...state,
        show: action.show,
        active_season:action.active_season,
        episodes:action.episodes,
        color:action.color,
        muted_color:action.muted_color,
        loading:false,
      }

      case ADD_FAVORITE_SHOW:
        return {
          ...state,
          show: {...state.show,favorite_key:action.key,favorite:true}
        }

      case REMOVE_FAVORITE_SHOW:
        return {
          ...state,
          show: {...state.show,favorite_key:null,favorite:false}
        }

      case GET_SEASON:
        return {
          ...state,
          active_season:action.active_season,
          episodes:action.episodes,
        }

      case LOADING_API:
        return {
          ...state,
          loading: true,
        }
    default:
      return state
  }
}

export const getShow = (showid) => {
  return dispatch => {
    dispatch({
     type: LOADING_API,
   })
   auth.onAuthStateChanged((user) => {
     const user_id_str = user ? `?user_id=${user.uid}`:'';
     fetch(`${SHOW_API}/${showid}${user_id_str}`)
       .then(response => response.json())
       .then(res =>{
         const show = res.show;
         const active_season =show.seasons[0];
         const episodes =show.seasons[0].episodes;
         const color = res.color.Muted._rgb;
         const muted_color = res.color.DarkMuted ?  res.color.DarkMuted._rgb : res.color.LightMuted._rgb;
         return dispatch({
           type: GET_SHOW,
           show,
           active_season,
           episodes,
           color,
           muted_color,
         })
       });
   })
  }
}

export const getSeason = (season)=>{
  return dispatch =>{
     dispatch({
      type: GET_SEASON,
      active_season:season,
      episodes:season.episodes,
    })
  }
}

export const addToFavorites = (show,userid)=>{
  return dispatch => {
    const showid = show.id
    const params = {showid,userid};
    fetch(SHOW_FAVORITES_API,{
      method:'POST',
      headers: new Headers({
             'Content-Type': 'application/json', // <-- Specifying the Content-Type
      }),
      body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then((response)=>{
      const key = response.key;
      dispatch({
        type: ADD_FAVORITE_SHOW,
        key,
      })
    })
  }
}


export const removeFromFavorites = (key)=>{
  return dispatch => {
    fetch(`${SHOW_FAVORITES_API}/${key}`,{
      method:'DELETE',
      headers: new Headers({
             'Content-Type': 'application/json', // <-- Specifying the Content-Type
      }),
    })
    .then(response => response.json())
    .then((response)=>{
      dispatch({
        type: REMOVE_FAVORITE_SHOW
      })
    })
  }
}
