export const GET_SCHEDULE = 'GET_SCHEDULE'
export const SET_TIME = 'SET_TIME'
export const SET_FILTER = 'SET_FILTER'

const SCHEDULE_API = `//${window.location.hostname}:3002/api/schedule`;

const initialState = {
  shows: [],
  times:[],
  time_of_day:'morning',
  filter:'',
  date:'',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SCHEDULE:
      return {
        ...state,
        shows: action.shows,
        times:action.times,
        date:action.date,
      }

    case SET_TIME:
      return {
        ...state,
        time_of_day: action.time
      }

    case SET_FILTER:
      return {
        ...state,
        filter: action.filter
      }
    default:
      return state
  }
}

export const getSchedule = (filter='',date='') => {
  const filter_str = `?filter=${filter}`;
  return dispatch => {
    fetch(`${SCHEDULE_API}${filter_str}${date}`)
      .then(response => response.json())
      .then(res =>{
        let schedule = res;
        return dispatch({
          type: GET_SCHEDULE,
          ...schedule,
          date,
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

export const setTimeOfDay = (time) =>{
  return dispatch =>{
     dispatch({
      type: SET_TIME,
      time,
    })
  }
}
