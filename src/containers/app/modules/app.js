import ColorThief from '@mariotacke/color-thief';

const color_thief = new ColorThief();

export const SET_BACKGROUND_COLOR = 'SET_BACKGROUND_COLOR'
export const SET_BACKGROUND_IMAGE = 'SET_BACKGROUND_IMAGE'
export const SET_TIME = 'SET_TIME'
export const SET_BODY = 'SET_BODY'
export const GET_SEARCH = 'GET_SEARCH'
export const LOADING_API = 'LOADING_API'
export const CLEAR_SEARCH_TEXT = 'CLEAR_SEARCH_TEXT'
export const UPDATE_SEARCH_TEXT = 'UPDATE_SEARCH_TEXT'



const SCHEDULE_API = `//${window.location.hostname}:3002/api/schedule`;
const SEARCH_API = `//${window.location.hostname}:3002/api/search/shows`;

const initialState = {
  backgroundColor: [255,255,255],
  backgroundImage:'',
  time_of_day:'morning',
  body:{},
  loading:false,
  searchtext:'',
  searchResults:[],

}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_BACKGROUND_COLOR:
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

    case SET_TIME:
      return {
        ...state,
        time_of_day: action.time
      }

    case CLEAR_SEARCH_TEXT:
      return {
        ...state,
        searchtext: ''
      }

    case UPDATE_SEARCH_TEXT:
      return {
        ...state,
        searchtext: action.searchText,
      }

      case LOADING_API:
        return {
          ...state,
          loading: action.loading,
        }

      case SET_BODY:
        return {
          ...state,
          body: action.body
        }

      case GET_SEARCH:
        return {
          ...state,
          searchResults: action.searchResults
        }
    default:
      return state
  }
}

export const setBackGroundColor = (color) => {
  return dispatch =>{
     dispatch({
      type: SET_BACKGROUND_COLOR,
      color
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

export const setTimeOfDay = (time) =>{
  return dispatch =>{
     dispatch({
      type: SET_TIME,
      time,
    })
  }
}

export const setBody = (body)=>{
  return dispatch =>{
     dispatch({
      type: SET_BODY,
      body,
    })
  }
}

export const setLoader = (loading)=>{
  return dispatch =>{
     dispatch({
      type: LOADING_API,
      loading,
    })
  }
}

export const clearSearchText = ()=>{
  return dispatch =>{
     dispatch({
      type: CLEAR_SEARCH_TEXT,
    })
  }
}

export const updateSearchText = (searchText)=>{
  return dispatch =>{
     dispatch({
      type: UPDATE_SEARCH_TEXT,
      searchText,
    })
  }
}

export const getSearch = (searchText='') => {
  return dispatch =>{
    fetch(`${SEARCH_API}?q=${searchText}`)
      .then(response => response.json())
      .then(res =>{
        const searchResults = res;
        return dispatch({
          type: GET_SEARCH,
          searchResults,
        })
      });
  }
}
