import { auth } from '../../../firebase.js';

export const GET_SEARCH_PAGE = 'GET_SEARCH_PAGE'
export const LOADING_API = 'LOADING_API'

export const ADD_FAVORITE = 'ADD_FAVORITE'
export const REMOVE_FAVORITE = 'REMOVE_FAVORITE'



const SEARCH_FAVORITES_API = `//${window.location.hostname}:${window.location.port}/api/favorites`;

const SEARCH_API = `//${window.location.hostname}:${window.location.port}/api/search/shows/full`;

const initialState = {
  shows: [],
  times:[],
  color:[255,255,255],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SEARCH_PAGE:
      return {
        ...state,
        shows: action.shows,
        color:action.color,
        time_of_day:action.time_of_day,
        loading:false,
        muted_color:action.muted_color
      }

    case ADD_FAVORITE:
      return{
        ...state,
        shows: state.shows.reduce((acc,curr)=>{
          if(curr.id === action.show.id){
            curr.favorite = true;
            curr.favorite_key = action.key;
          }
          return [...acc,curr];

        },[]),
      }

    case REMOVE_FAVORITE:
      return{
        ...state,
        shows: state.shows.reduce((acc,curr)=>{
          if(curr.id === action.show.id){
            curr.favorite = false;
          }
          return [...acc,curr];

        },[]),
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
export const getSearch = (searchText='') => {
  return dispatch =>{
    dispatch({
     type: LOADING_API,
   })
   auth.onAuthStateChanged((user) => {
     const user_id_str = user ? `&user_id=${user.uid}`:'';
     fetch(`${SEARCH_API}?q=${searchText}${user_id_str}`)
       .then(response => response.json())
       .then(res =>{
         const shows = res.shows;
         const color = res.color.Muted._rgb;
         const time_of_day = res.time_of_day;
         const muted_color = res.color.DarkMuted ?  res.color.DarkMuted._rgb : res.color.LightMuted._rgb;
         return dispatch({
           type: GET_SEARCH_PAGE,
           shows,
           time_of_day,
           color,
           muted_color,
         })
       });
   });
  }
}

export const addToFavorites = (show,userid)=>{
  return dispatch => {
    const showid = show.id
    const params = {showid,userid};
    fetch(SEARCH_FAVORITES_API,{
      method:'POST',
      headers: new Headers({
             'Content-Type': 'application/json', // <-- Specifying the Content-Type
      }),
      body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then((response)=>{
      const key = response.key;
      dispatch({
        type: ADD_FAVORITE,
        show,
        key,
      })
    })
  }
}

export const removeFromFavorites = (show,userid,key)=>{
  return dispatch => {
    fetch(`${SEARCH_FAVORITES_API}/${key}`,{
      method:'DELETE',
      headers: new Headers({
             'Content-Type': 'application/json', // <-- Specifying the Content-Type
      }),
    })
    .then(response => response.json())
    .then((response)=>{
      dispatch({
        type: REMOVE_FAVORITE,
        show
      })
    })
  }
}
