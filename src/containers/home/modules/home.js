import moment from 'moment'
import {setLoader} from '../../app/modules/app'
import firebase, { auth, provider } from '../../../firebase.js';


export const GET_SCHEDULE = 'GET_SCHEDULE'
export const SET_FILTER = 'SET_FILTER'
export const SET_DATE = 'SET_DATE'
export const LOADING_API = 'LOADING_API'



const SCHEDULE_API = `//${window.location.hostname}:3002/api/schedule`;

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
        favorites: action.favorites,
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
            const color =  res.color.Muted._rgb;
            const muted_color = res.color.DarkMuted ?  res.color.DarkMuted._rgb : res.color.LightMuted._rgb;
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

export const setFilter = (filter)=>{
  return dispatch =>{
    dispatch(setLoader(true));
    dispatch({
      type: SET_FILTER,
      filter
    })
  }
}

export const setDate = (date)=>{
  return dispatch =>{
    dispatch(setLoader(true));
    dispatch({
      type: SET_DATE,
      date
    })
  }
}
