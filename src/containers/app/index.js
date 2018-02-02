import React from 'react';
import { Route, NavLink } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {connectWithLifecycle} from 'react-lifecycle-component/lib'
import { withRouter } from 'react-router'
import Home from '../home'
import Shows from '../shows'
import './app.css'
import {
  grey100, grey300, grey500,
  white, darkBlack, fullBlack,} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {getBackGroundColor, setBackGroundImage, setTimeOfDay} from './modules/app'
import logoLight from './images/logo-light.svg'
import moment from 'moment'


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
  this.backgroundColor = backgroundColor;
  this.setTimeOfDay = props.setTimeOfDay;
  return (
  <MuiThemeProvider muiTheme={muiTheme}>
    <div className="app">
      <div className="app-body" ref={(elm)=>this.appBody = elm} style={{backgroundColor}}>
        <header className="app-header"  ref={(elm)=>this.appHeader = elm}>
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

        <main className={`main-content ${props.location.pathname.split('/')[1] == "shows" ? "show":""}`}   ref={(elm)=>this.mainContent = elm} >
          <Route exact path="/" component={Home} />
          <Route exact path="/shows/:id" component={Shows} />
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
  time_of_day: state.app.time_of_day,

})


const attachEvents = ()=>{
  this.appHeader.style.width = `${this.mainContent.getBoundingClientRect().width}px`;
  const html = document.querySelector('html');
  this.appBody.addEventListener('scroll',(e)=>{
    this.appHeader.style.width = `${this.mainContent.getBoundingClientRect().width}px`;
    if(this.appBody.scrollTop >= 320){
      html.style.setProperty('--header-background', this.backgroundColor );
    }else{
      html.style.setProperty('--header-background', 'transparent');
    }
  })

  const hour = moment().hour();
  switch (true){
    case hour >=4 && hour < 12:
      this.setTimeOfDay('morning');
      break;
    case hour >= 12 && hour < 17:
      this.setTimeOfDay('midday');
      break;
    case hour >= 18 && hour < 22:
      this.setTimeOfDay('evening');
      break;
    case hour >= 22 || (hour  >= 0 && hour < 4):
      this.setTimeOfDay('latenight');
  }
}


const mapDispatchToProps = dispatch => ({
  componentDidMount:()=>attachEvents(),
  ...bindActionCreators({
    getBackGroundColor,
    setBackGroundImage,
    setTimeOfDay,
}, dispatch)})

export default withRouter(connectWithLifecycle(
  mapStateToProps,
  mapDispatchToProps
)(App))
