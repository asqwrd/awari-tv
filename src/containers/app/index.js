import React from 'react';
import { Route, NavLink } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import {connectWithLifecycle} from 'react-lifecycle-component/lib'
import { withRouter } from 'react-router'
import Home from '../home'
import Shows from '../shows'
import Search from '../search'
import './app.css'
import {
  grey100, grey300, grey500,
  white, darkBlack, fullBlack,} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {setBackGroundColor, setBackGroundImage, setTimeOfDay, setBody, getSearch, clearSearchText, updateSearchText} from './modules/app'
import logoLight from './images/logo-light.svg'
import moment from 'moment'
import RefreshIndicator from 'material-ui/RefreshIndicator';
import AutoComplete from 'material-ui/AutoComplete';




const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#582335',
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
  const {backgroundColor,backgroundImage,gradient, loading, searchtext} = props;
  this.backgroundColor = backgroundColor;
  this.setTimeOfDay = props.setTimeOfDay;
  this.setScrollPosition = props.setScrollPosition;
  this.html = document.querySelector('html');
  this.handleUpdateInput = (searchText) => {
    props.updateSearchText(searchText);
    props.getSearch(searchText);
  };

  this.handleNewRequest = (chosenRequest,index) => {
    console.log(chosenRequest);
    console.log(props);
    if(chosenRequest && chosenRequest.id){
      props.changePage(`/shows/${chosenRequest.id}`);
    }else if(chosenRequest){
      props.changePage(`/search/${chosenRequest}`)
    }

    props.clearSearchText();
  };

  return (
  <MuiThemeProvider muiTheme={muiTheme}>
    <div className="app">
      <div className="app-body" ref={(elm)=>{this.appBody = elm; props.setBody(this.appBody)}} style={{backgroundColor}}>
        <header className="app-header"  ref={(elm)=>this.appHeader = elm}>
          <NavLink to='/'><img className="logo" src={logoLight}/></NavLink>
          <div>
            <AutoComplete
              hintText="Search"
              searchText={props.searchtext}
              onUpdateInput={this.handleUpdateInput}
              onNewRequest={this.handleNewRequest}
              dataSource={props.searchResults}
              dataSourceConfig={{text:'name', value:'id'}}
              openOnFocus={true}
              filter={AutoComplete.fuzzyFilter}
            />
          </div>
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
          <Route exact path="/search/:query" component={Search} />
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
  loading: state.app.loading,
  searchResults:state.app.searchResults,
  searchtext:state.app.searchtext,

})


  const scrollTop = ()=>{
    this.appBody.scrollTo(0,0);
  }


const attachEvents = ()=>{
  this.appHeader.style.width = `${this.mainContent.getBoundingClientRect().width}px`;
  this.appBody.addEventListener('scroll',(e)=>{
    this.appHeader.style.width = `${this.mainContent.getBoundingClientRect().width}px`;
    if(this.appBody.scrollTop >= 320){
      this.html.style.setProperty('--header-background', this.backgroundColor );
    }else{
      this.html.style.setProperty('--header-background', 'transparent');
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
  componentDidUpdate:()=>scrollTop(),
  ...bindActionCreators({
    setBackGroundColor,
    setBackGroundImage,
    setTimeOfDay,
    setBody,
    getSearch,
    clearSearchText,
    updateSearchText,
    changePage:(page)=> push(page),
}, dispatch)})

export default withRouter(connectWithLifecycle(
  mapStateToProps,
  mapDispatchToProps
)(App))
