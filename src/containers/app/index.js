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


const App = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <div className="app">
      <header className="header-container">
      </header>

      <main className="main-content">
        <Route exact path="/" component={Home} />
      </main>
    </div>
  </MuiThemeProvider>
)

const mapStateToProps = (state, ownProps) => ({
})

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))
