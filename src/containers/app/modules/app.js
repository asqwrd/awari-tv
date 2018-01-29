import ColorThief from '@mariotacke/color-thief';

const color_thief = new ColorThief();

export const GET_BACKGROUND_COLOR = 'GET_BACKGROUND_COLOR'
export const SET_BACKGROUND_IMAGE = 'SET_BACKGROUND_IMAGE'


const SCHEDULE_API = `//${window.location.hostname}:3002/api/schedule`;

const initialState = {
  backgroundColor: '',
  backgroundImage:'',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_BACKGROUND_COLOR:
      console.log(action);
      const backgroundColor = `rgb(${action.color[0]},${action.color[1]},${action.color[2]})`
      const gradient = `rgba(${action.color[0]},${action.color[1]},${action.color[2]},0)`
      return {
        ...state,
        backgroundColor,
        gradient,
      }

    case SET_BACKGROUND_IMAGE:
      console.log(action);
      return {
        ...state,
        backgroundImage: action.image
      }
    default:
      return state
  }
}

export const getBackGroundColor = (image) => {
  return dispatch => {
    color_thief.getColorAsync(image,(color,element)=>{
      return dispatch({
        type: GET_BACKGROUND_COLOR,
        color
      })
    })
  }
}

export const setBackGroundImage = (image) =>{
  return dispatch =>{
     dispatch({
      type: SET_BACKGROUND_IMAGE,
      image
    })
  }
}
