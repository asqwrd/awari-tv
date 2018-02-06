
export const GET_SEARCH_PAGE = 'GET_SEARCH_PAGE'
export const LOADING_API = 'LOADING_API'



const SEARCH_API = `//${window.location.hostname}:3002/api/search/shows/full`;

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
    fetch(`${SEARCH_API}?q=${searchText}`)
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
  }
}
