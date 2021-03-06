import React from 'react';
import { Route, NavLink } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {connectWithLifecycle} from 'react-lifecycle-component/lib'
import { withRouter } from 'react-router'
import Home from '../home'
import Shows from '../shows'
import Search from '../search'
import Favorites from '../favorites'
import './app.css'
import {
 darkBlack,} from 'material-ui/styles/colors';
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
  toggleMobilePopover,
} from './modules/app'
import logoLight from './images/logo-light.svg'
import AutoComplete from 'material-ui/AutoComplete';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';





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
    alternateTextColor: '#aaa',
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
  }
  this.handleRequestClose = ()=>{
    props.togglePopover()
  }

  this.handleClickMobile = (event)=>{
    event.preventDefault();
    props.toggleMobilePopover()
  }
  this.handleRequestMobileClose = ()=>{
    props.toggleMobilePopover()
  }

  return (
  <MuiThemeProvider muiTheme={muiTheme}>
    <div className="app">
      <div className="app-body" ref={(elm)=>{this.appBody = elm; props.setBody(this.appBody)}} style={{backgroundColor}}>
        <header className="app-header"  ref={(elm)=>this.appHeader = elm}>
          <div className="logo-container"><NavLink to='/'><img className="logo" src={logoLight} alt="logo"/></NavLink></div>
          <div className="search desktop">
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
          <div className="search mobile">
            <img className="logo" src={logoLight} alt="logo" ref={(elm)=>this.logoMobile = elm}/>
            <nav className="header-nav mobile">
            <NavLink to='/'>
              <IconButton>
               <FontIcon className="material-icons">home</FontIcon>
             </IconButton>
            </NavLink>
            {user ?
              <div>
                <div className="avatar-container" ref={(elm)=>this.avatarMobile = elm}>
                  <Avatar src={user.photoURL}   onClick={this.handleClickMobile} size={32}/>
                </div>
                <Popover
                  open={props.login_open_mobile}
                  anchorEl={this.avatarMobile}
                  anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                  onRequestClose={this.handleRequestMobileClose}
                >
                  <Menu>
                    <MenuItem primaryText="Favorites" onClick={()=>{props.changePage('/favorites'); props.toggleMobilePopover()}}/>
                    <MenuItem primaryText="Sign out" onClick={props.logout} />
                  </Menu>
                </Popover>
              </div>
              :<Avatar onClick={props.login} icon={<FontIcon className="material-icons">person</FontIcon>} size={32}/>
            }
            </nav>
            <AutoComplete
              hintText=""
              searchText={props.searchtext}
              onUpdateInput={this.handleUpdateInput}
              onNewRequest={this.handleNewRequest}
              dataSource={props.searchResults}
              dataSourceConfig={{text:'name', value:'id'}}
              openOnFocus={true}
              filter={AutoComplete.fuzzyFilter}
              fullWidth={true}
              style={{width:'calc(100% - 80px)'}}
              onFocus={()=>this.logoMobile.style.opacity = 0}
              onBlur={()=>this.logoMobile.style.opacity = 1}
              name='auto-complete-mobile'
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
                  <MenuItem primaryText="Favorites" onClick={()=>{props.changePage('/favorites'); props.togglePopover()}}/>
                  <MenuItem primaryText="Sign out" onClick={props.logout} />
                </Menu>
              </Popover>
            </div>
            :<Avatar onClick={props.login} icon={<FontIcon className="material-icons">person</FontIcon>} />
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
          <Route exact path="/favorites" component={Favorites} />
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
  login_open_mobile:state.app.login_open_mobile,

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
  window.addEventListener('resize',(e)=>{
    this.appHeader.style.width = `${this.mainContent.getBoundingClientRect().width}px`;
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
    toggleMobilePopover,
    changePage:(page)=> push(page),
}, dispatch)})

export default withRouter(connectWithLifecycle(
  mapStateToProps,
  mapDispatchToProps
)(App))
