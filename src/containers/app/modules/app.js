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
      const backgroundColor = `rgb(${action.color[0]},${action.color[1]},${action.color[2]})`
      const gradient = `rgba(${action.color[0]},${action.color[1]},${action.color[2]},0)`
      return {
        ...state,
        backgroundColor,
        gradient,
      }

    case SET_BACKGROUND_IMAGE:
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

export const changefontcolor = (rgb:Array<any>)=>{
      let c = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
      let o = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);
      const html = document.querySelector('html');
      if(o > 125){

        html.style.setProperty('--accent-color','#333');
      }else{
        html.style.setProperty('--accent-color','#fff');
      }
}
