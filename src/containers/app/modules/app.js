import { auth, provider } from '../../../firebase.js';


export const SET_BACKGROUND_COLOR = 'SET_BACKGROUND_COLOR'
export const SET_BACKGROUND_IMAGE = 'SET_BACKGROUND_IMAGE'
export const SET_TIME = 'SET_TIME'
export const SET_BODY = 'SET_BODY'
export const GET_SEARCH = 'GET_SEARCH'
export const LOADING_API = 'LOADING_API'
export const CLEAR_SEARCH_TEXT = 'CLEAR_SEARCH_TEXT'
export const UPDATE_SEARCH_TEXT = 'UPDATE_SEARCH_TEXT'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const TOGGLE_POPOVER = 'TOGGLE_POPOVER'



const SEARCH_API = `//${window.location.hostname}:3002/api/search/shows`;
const AUTH_API = `//${window.location.hostname}:3002/api/auth`;

const initialState = {
  backgroundColor: [255,255,255],
  backgroundImage:'',
  time_of_day:'morning',
  body:{},
  loading:false,
  searchtext:'',
  searchResults:[],
  user:null,
  login_open:false,

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

      case LOGIN:
        return {
          ...state,
          user: action.user,
          login_open:false,
        }

      case LOGOUT:
        return {
          ...state,
          user: null,
          login_open:false,
        }

      case TOGGLE_POPOVER:
        return {
          ...state,
          login_open: !state.login_open,
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

export const changefontcolor = (cssVar, rgb:Array<any>)=>{
      let o = Math.round(((parseInt(rgb[0],10) * 299) + (parseInt(rgb[1],10) * 587) + (parseInt(rgb[2],10) * 114)) / 1000);
      const html = document.querySelector('html');
      if(o > 125){
        html.style.setProperty(cssVar,'#333');
      }else{
        html.style.setProperty(cssVar,'#fff');
      }
}

export const changeColorVar = (cssVar,rgb:Array<any>)=>{
      const color = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
      const html = document.querySelector('html');
      html.style.setProperty(cssVar,color);
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

export const login = () =>{
  return dispatch =>{
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        return dispatch({
          type: LOGIN,
          user,
        })
      });
  }
}

export const logout = () =>{
  return dispatch =>{
    auth.signOut()
      .then(() => {
        return dispatch({
          type: LOGOUT,
        })
      });
  }
}


export const onAuthStateChanged = ()=>{
  return dispatch =>{
    auth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then((token)=>{
          fetch(`${AUTH_API}?token=${token}`).then(res=>{
            return dispatch({
              type: LOGIN,
              user,
            })
          })
        })
      }
    });
  }
}

export const togglePopover = () =>{
  return dispatch =>{
    return dispatch({
      type:TOGGLE_POPOVER,
    })
  }
}
