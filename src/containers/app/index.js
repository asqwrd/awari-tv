import React from 'react';
import { Route, NavLink } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Home from '../home'
import './app.css'
import {
  grey100, grey300, grey500,
  white, darkBlack, fullBlack,} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {getBackGroundColor, setBackGroundImage} from './modules/app'
import logoLight from './images/logo-light.svg'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: fullBlack,
    primary2Color: fullBlack,
    primary3Color: fullBlack,
    accent1Color: '#582335',
    accent2Color: fullBlack,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
  },

});


const App = (props) =>{
  const {backgroundColor,backgroundImage,gradient} = props;
  console.log(backgroundColor,backgroundImage);
  return (
  <MuiThemeProvider muiTheme={muiTheme}>
    <div className="app">
      <div className="app-body">
        <header className="app-header">
          <img className="logo" src={logoLight}/>
        </header>
        <div className="dynamic-background">
          <div className="background-color" style={{backgroundColor}}></div>

          <div className="background-image-container">
            <div className="background-images">
              <div className="background-image show" style={{backgroundImage:`url(${backgroundImage})`}}></div>
            </div>
            <div className="background-gradient" style={{background:`linear-gradient(to top,${backgroundColor},${gradient}),linear-gradient(to right, ${backgroundColor},${gradient})`}}></div>
          </div>
        </div>

        <main className="main-content" style={{backgroundColor}}>
          <Route exact path="/" component={Home} />
        </main>
      </div>
    </div>
  </MuiThemeProvider>
  )
}

const mapStateToProps = (state, ownProps) => ({
  backgroundColor:state.app.backgroundColor,
  backgroundImage:state.app.backgroundImage,
  gradient:state.app.gradient,

})


const mapDispatchToProps = dispatch => bindActionCreators({
  getBackGroundColor,
  setBackGroundImage,
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))
