import moment from 'moment'
import { auth } from '../../../firebase.js';


export const GET_SCHEDULE = 'GET_SCHEDULE'
export const SET_FILTER = 'SET_FILTER'
export const SET_DATE = 'SET_DATE'
export const LOADING_API = 'LOADING_API'
export const ADD_FAVORITE_HOME = 'ADD_FAVORITE_HOME'
export const REMOVE_FAVORITE_HOME = 'REMOVE_FAVORITE_HOME'



const SCHEDULE_API = `//${window.location.hostname}:${window.location.port}/api/schedule`;
const SCHEDULE_FAVORITES_API = `//${window.location.hostname}:${window.location.port}/api/favorites`;


const initialState = {
  shows: [],
  times:[],
  filter:'',
  date:new Date(),
  color:[255,255,255],
  mute_color:[255,255,255],
  favorites:[],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SCHEDULE:
      return {
        ...state,
        shows: action.shows,
        favorites: action.favorites || [],
        times:action.times,
        color:action.color,
        muted_color:action.muted_color,
        loading:false,
      }

    case SET_FILTER:
      return {
        ...state,
        filter: action.filter
      }

    case ADD_FAVORITE_HOME:
      return{
        ...state,
        shows: state.shows.reduce((acc,curr)=>{
          if(curr.show.id === action.show.id){
            curr.show.favorite = true;
            curr.show.favorite_key = action.key;
          }
          return [...acc,curr];

        },[]),
        favorites: [...state.favorites,{show:action.show}],
      }

    case REMOVE_FAVORITE_HOME:
      return{
        ...state,
        shows: state.shows.reduce((acc,curr)=>{
          if(curr.show.id === action.show.id){
            curr.show.favorite = false;
          }
          return [...acc,curr];

        },[]),
        favorites: state.favorites.filter((show,index)=>{
          return show.show.id !== action.show.id;

        }),
      }

    case SET_DATE:
      return {
        ...state,
        date: action.date
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

export const getSchedule = (filter='',date=moment().format('YYYY-MM-DD')) => {
    return dispatch => {
      dispatch({
       type: LOADING_API,
      })
      auth.onAuthStateChanged((user) => {
        const filter_str = `?filter=${filter}`;
        const date_str = `date=${date}`;
        const user_id_str = user ? `&user_id=${user.uid}`:'';
        fetch(`${SCHEDULE_API}${filter_str}&${date_str}${user_id_str}`)
          .then(response => response.json())
          .then(res =>{
            const schedule = res;
            const color =  res.color.Muted ? res.color.Muted._rgb : res.color.Vibrant._rgb;
            const muted_color = res.color.DarkMuted ?  res.color.DarkMuted._rgb : res.color.LightMuted ? res.color.LightMuted._rgb : res.color.LightVibrant._rgb;
            const time_of_day = res.time_of_day;
            return dispatch({
              type: GET_SCHEDULE,
              ...schedule,
              color,
              muted_color,
              time_of_day,
            })
          });
      });
  }
}

export const addToFavorites = (show,userid)=>{
  return dispatch => {
    const showid = show.id
    const params = {showid,userid};
    fetch(SCHEDULE_FAVORITES_API,{
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
        type: ADD_FAVORITE_HOME,
        show,
        key,
      })
    })
  }
}

export const removeFromFavorites = (show,userid,key)=>{
  return dispatch => {
    fetch(`${SCHEDULE_FAVORITES_API}/${key}`,{
      method:'DELETE',
      headers: new Headers({
             'Content-Type': 'application/json', // <-- Specifying the Content-Type
      }),
    })
    .then(response => response.json())
    .then((response)=>{
      dispatch({
        type: REMOVE_FAVORITE_HOME,
        show
      })
    })
  }
}

export const setFilter = (filter)=>{
  return dispatch =>{
    dispatch({
      type: SET_FILTER,
      filter
    })
  }
}

export const setDate = (date)=>{
  return dispatch =>{
    dispatch({
      type: SET_DATE,
      date
    })
  }
}
