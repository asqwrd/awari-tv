

export const GET_SHOW = 'GET_SHOW'
export const GET_SEASON = 'GET_SEASON'
export const LOADING_API = 'LOADING_API'


const SHOW_API = `//${window.location.hostname}:3002/api/shows`;

const initialState = {
  show: {image:{original:''},seasons:[],name:'', _embedded:{episodes:[]}},
  active_season:{},
  color:[255,255,255],
  mute_color:[255,255,255],
  loading:false,
  episodes:[]
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SHOW:
      return {
        ...state,
        show: action.show,
        active_season:action.active_season,
        episodes:action.episodes,
        color:action.color,
        muted_color:action.muted_color,
        loading:false,
      }

      case GET_SEASON:
        return {
          ...state,
          active_season:action.active_season,
          episodes:action.episodes,
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

export const getShow = (showid) => {
  return dispatch => {
    dispatch({
     type: LOADING_API,
   })
    fetch(`${SHOW_API}/${showid}`)
      .then(response => response.json())
      .then(res =>{
        const show = res.show;
        const active_season =show.seasons[0];
        const episodes =show.seasons[0].episodes;
        const color = res.color.Muted._rgb;
        const muted_color = res.color.DarkMuted ?  res.color.DarkMuted._rgb : res.color.LightMuted._rgb;
        return dispatch({
          type: GET_SHOW,
          show,
          active_season,
          episodes,
          color,
          muted_color,
        })
      });
  }
}

export const getSeason = (season)=>{
  return dispatch =>{
     dispatch({
      type: GET_SEASON,
      active_season:season,
      episodes:season.episodes,
    })
  }
}
