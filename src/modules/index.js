import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import home from '../containers/home/modules/home'
import app from '../containers/app/modules/app'

export default combineReducers({
  router: routerReducer,
  app,
  home,
})
