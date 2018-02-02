import moment from 'moment'

export const GET_SHOW = 'GET_SHOW'


const SHOW_API = `//${window.location.hostname}:3002/api/shows`;

const initialState = {
  show: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SHOW:
    console.log(action);
      return {
        ...state,
        show: action.show,
      }
    default:
      return state
  }
}

export const getShow = (showid) => {
  return dispatch => {
    fetch(`${SHOW_API}/${showid}`)
      .then(response => response.json())
      .then(res =>{
        let show = res;
        return dispatch({
          type: GET_SHOW,
          show,
        })
      });
  }
}
