import moment from 'moment'
import {setLoader} from '../../app/modules/app'

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
  color:[255,255,255]
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SCHEDULE:
      return {
        ...state,
        shows: action.shows,
        times:action.times,
        color:action.color,
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
  const filter_str = `?filter=${filter}`;
  const date_str = `date=${date}`;
  return dispatch => {
    dispatch({
     type: LOADING_API,
   })
    fetch(`${SCHEDULE_API}${filter_str}&${date_str}`)
      .then(response => response.json())
      .then(res =>{
        const schedule = res;
        const color =  res.color.Muted._rgb;
        const time_of_day = res.time_of_day;
        return dispatch({
          type: GET_SCHEDULE,
          ...schedule,
          color,
          time_of_day,
        })
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
