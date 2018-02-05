import React from 'react';
import { Route, NavLink } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {connectWithLifecycle} from 'react-lifecycle-component/lib'
import { withRouter } from 'react-router'
import Home from '../home'
import Shows from '../shows'
import Search from '../search'
import './app.css'
import {
  white, darkBlack,} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {setBackGroundColor,
  setBackGroundImage,
  setTimeOfDay,
  setBody,
  getSearch,
  clearSearchText,
  updateSearchText,
  login,
  logout,
  onAuthStateChanged,
  togglePopover,
} from './modules/app'
import logoLight from './images/logo-light.svg'
import AutoComplete from 'material-ui/AutoComplete';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';





const muiTheme = getMuiTheme({
  palette: {
    primary1Color: 'var(--muted-color)',
    primary2Color: 'var(--muted-color)',
    primary3Color: 'var(--muted-color)',
    accent1Color: 'var(--muted-color)',
    accent2Color: 'var(--muted-color)',
    accent3Color: 'var(--muted-color)',
    pickerHeaderColor: 'var(--muted-color)',
    textColor: darkBlack,
    alternateTextColor: white,
  },

});


const App = (props) =>{
  const {backgroundColor,backgroundImage,gradient, user} = props;
  this.backgroundColor = backgroundColor;
  this.setTimeOfDay = props.setTimeOfDay;
  this.setScrollPosition = props.setScrollPosition;
  this.html = document.querySelector('html');
  this.onAuthStateChanged = props.onAuthStateChanged;
  this.handleUpdateInput = (searchText) => {
    props.updateSearchText(searchText);
    props.getSearch(searchText);
  };

  this.handleNewRequest = (chosenRequest,index) => {
    if(chosenRequest && chosenRequest.id){
      props.changePage(`/shows/${chosenRequest.id}`);
    }else if(chosenRequest){
      props.changePage(`/search/${chosenRequest}`)
    }

    props.clearSearchText();
  };

  this.handleClick = (event)=>{
    event.preventDefault();
    props.togglePopover()
    console.log('hi')
  }
  this.handleRequestClose = ()=>{
    props.togglePopover()
  }

  return (
  <MuiThemeProvider muiTheme={muiTheme}>
    <div className="app">
      <div className="app-body" ref={(elm)=>{this.appBody = elm; props.setBody(this.appBody)}} style={{backgroundColor}}>
        <header className="app-header"  ref={(elm)=>this.appHeader = elm}>
          <div className="logo-container"><NavLink to='/'><img className="logo" src={logoLight} alt="logo"/></NavLink></div>
          <div className="search">
            <AutoComplete
              hintText="Search"
              searchText={props.searchtext}
              onUpdateInput={this.handleUpdateInput}
              onNewRequest={this.handleNewRequest}
              dataSource={props.searchResults}
              dataSourceConfig={{text:'name', value:'id'}}
              openOnFocus={true}
              filter={AutoComplete.fuzzyFilter}
              fullWidth={true}
            />
          </div>
          <nav className="header-nav">
          {user ?
            <div>
              <div className="avatar-container" ref={(elm)=>this.avatar = elm}>
                <Avatar src={user.photoURL}   onClick={this.handleClick} />
              </div>
              <Popover
                open={props.login_open}
                anchorEl={this.avatar}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                onRequestClose={this.handleRequestClose}
              >
                <Menu>
                  <MenuItem primaryText="Favorites" />
                  <MenuItem primaryText="Sign out" onClick={props.logout} />
                </Menu>
              </Popover>
            </div>
            :
            <button onClick={props.login}>Log In</button>
          }
          </nav>
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

        <main className="main-content"   ref={(elm)=>this.mainContent = elm} >
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
  searchResults:state.app.searchResults,
  searchtext:state.app.searchtext,
  user:state.app.user,
  login_open:state.app.login_open,

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
  this.onAuthStateChanged();
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
    onAuthStateChanged,
    login,
    logout,
    togglePopover,
    changePage:(page)=> push(page),
}, dispatch)})

export default withRouter(connectWithLifecycle(
  mapStateToProps,
  mapDispatchToProps
)(App))
