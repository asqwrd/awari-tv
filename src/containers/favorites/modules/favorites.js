import { auth } from '../../../firebase.js';

export const GET_FAVORITES_PAGE = 'GET_FAVORITES_PAGE'
export const LOADING_API = 'LOADING_API'




const FAVORITES_API = `//${window.location.hostname}:3002/api/favorites`;

const initialState = {
  shows: [],
  times:[],
  color:[255,255,255],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_FAVORITES_PAGE:
      return {
        ...state,
        shows: action.shows,
        color:action.color,
        time_of_day:action.time_of_day,
        muted_color:action.muted_color,
        loading:false,
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
export const getFavorites = () => {
  return dispatch =>{
    dispatch({
     type: LOADING_API,
   })
   auth.onAuthStateChanged((user) => {
     const user_id_str = user ? `?user_id=${user.uid}`:'';
     fetch(`${FAVORITES_API}${user_id_str}`)
       .then(response => response.json())
       .then(res =>{
         console.log(res);
         const shows = res.shows;
         const color = res.color.Muted._rgb;
         const time_of_day = res.time_of_day;
         const muted_color = res.color.DarkMuted ?  res.color.DarkMuted._rgb : res.color.LightMuted._rgb;
         return dispatch({
           type: GET_FAVORITES_PAGE,
           shows,
           time_of_day,
           color,
           muted_color,
         })
       });
   })
  }
}
