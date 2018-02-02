import moment from 'moment'

export const GET_SCHEDULE = 'GET_SCHEDULE'
export const SET_FILTER = 'SET_FILTER'
export const SET_DATE = 'SET_DATE'


const SCHEDULE_API = `//${window.location.hostname}:3002/api/schedule`;

const initialState = {
  shows: [],
  times:[],
  filter:'',
  date:new Date(),
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SCHEDULE:
      return {
        ...state,
        shows: action.shows,
        times:action.times,
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
    default:
      return state
  }
}

export const getSchedule = (filter='',date=moment().format('YYYY-MM-DD')) => {
  const filter_str = `?filter=${filter}`;
  const date_str = `date=${date}`;
  return dispatch => {
    fetch(`${SCHEDULE_API}${filter_str}&${date_str}`)
      .then(response => response.json())
      .then(res =>{
        let schedule = res;
        return dispatch({
          type: GET_SCHEDULE,
          ...schedule,
        })
      });
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
