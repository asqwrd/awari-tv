import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import home from '../containers/home/modules/home'
import shows from '../containers/shows/modules/shows'
import app from '../containers/app/modules/app'
import search from '../containers/search/modules/search'
import favorites from '../containers/favorites/modules/favorites'

export default combineReducers({
  router: routerReducer,
  app,
  home,
  shows,
  search,
  favorites,
})
