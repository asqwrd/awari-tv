export const GET_SCHEDULE = 'GET_SCHEDULE'
export const SET_TIME = 'SET_TIME'

const SCHEDULE_API = `//${window.location.hostname}:3002/api/schedule`;

const initialState = {
  schedule: [],
  time_of_day:'morning',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SCHEDULE:
      return {
        ...state,
        schedule: action.schedule
      }

    case SET_TIME:
      console.log(action);
      return {
        ...state,
        time_of_day: action.time
      }
    default:
      return state
  }
}

export const getSchedule = () => {
  return dispatch => {
    fetch(SCHEDULE_API)
      .then(response => response.json())
      .then(res =>{
        let schedule = res;
        return dispatch({
          type: GET_SCHEDULE,
          schedule
        })
      });
  }
}

export const setTimeOfDay = (time) =>{
  return dispatch =>{
     dispatch({
      type: SET_TIME,
      time
    })
  }
}
