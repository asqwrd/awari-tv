import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import {connectWithLifecycle} from 'react-lifecycle-component/lib'
import {getSchedule, setFilter, setDate, addToFavorites, removeFromFavorites} from './modules/home'
import {setBackGroundColor, setBackGroundImage, changefontcolor, setTimeOfDay,changeColorVar} from '../app/modules/app'
import moment from 'moment'
import ShowCard from '../../components/show-card'
import './home.css'
import MIDDAY from '../app/images/midday.jpg';
import MORNING from '../app/images/morning.jpg';
import EVENING from '../app/images/evening.jpg';
import LATENIGHT from '../app/images/latenight.jpg';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import withinview from 'withinviewport/withinviewport'
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';







const Home = props => {
  const {shows, times, backgroundColor, time_of_day, filter, date, body, loading, user, backgroundColor2, favorites, appBackground} = props;
  this.backgroundColor = backgroundColor;
  this.backgroundColor2 = backgroundColor2;
  this.setBackGroundColor = props.setBackGroundColor;
  this.setBackGroundImage = props.setBackGroundImage;
  this.setTimeOfDay = props.setTimeOfDay;
  this.show = shows[0] ? shows[0].show:null;
  this.time_of_day = time_of_day;
  this.date = date;
  this.user = user;
  this.filter = filter;

  if(time_of_day === 'morning'){
    this.day_bg = MORNING;
  }else if(time_of_day === 'midday'){
    this.day_bg = MIDDAY;
  }else if(time_of_day === 'evening'){
    this.day_bg = EVENING;
  }else if(time_of_day === 'latenight'){
    this.day_bg = LATENIGHT;
  }

  const time = times.filter(time=>time.value === filter);
  const filterText = time[0] ? time[0].formatted:'All shows';

  this.handleChange = (event,value)=>{
    const date_str = moment(date).format('YYYY-MM-DD');
    props.getSchedule(value,date_str);
    props.setFilter(value);
  }
  this.handleDateChange = (event, date)=>{
    const date_str = moment(date).format('YYYY-MM-DD');
    props.getSchedule(filter,date_str);
    props.setDate(date);
  }
  const prevDate = moment(date).subtract('1','days').toDate();
  const nextDate = moment(date).add('1','days').toDate();
  this.scrollBody = body;
  this.handleScroll = (e)=>{
    let top = 70;
    if(favorites.length > 0){
      top = -70;
    }
    if((this.homeHeader && this.scrollBody) && !withinview(this.homeHeader,{container:this.scrollBody, top:top})){
      this.floatingNav.classList.add('show');
    }else if(this.floatingNav){
      this.floatingNav.classList.remove('show');
    }
  }
  if(this.scrollBody.addEventListener)
  this.scrollBody.addEventListener('scroll',this.handleScroll,true)
  const timesList = times.reduce((acc,time)=>{
    return [...acc,<ListItem
      value={time.value}
      primaryText={time.formatted}
      key={time.value}
      style={{color:'var(--muted-font-color)', textAlign:'center', fontSize:'14px'}}
      onClick={()=>this.handleChange(null,time.value)}
      />];
  },[])

  return (
    <div className="home-container">
      <RefreshIndicator
        size={50}
        left={50}
        top={50}
        loadingColor={`${appBackground}`}
        status={loading ? 'loading':'hide'}
        className={loading ? '':'hide'}
        style={{position:'fixed',zIndex:1000, transform:'translate(-50%,-50%)', left:'50%', top:'50%'}}
      />
      <header className="home-header" ref={(elm)=>this.homeHeader = elm} style={{opacity:loading? 0.3:1, pointerEvents:loading? 'none':'auto'}}>
        <span className="date">
          <DatePicker
            container="inline"
            mode="landscape"
            autoOk={true}
            name="date-picker"
            onChange={this.handleDateChange}
            value={date}
            textFieldStyle={{color:'var(--accent-color)', fontSize:'36px', fontWeight:'400', width:'auto', height:'70px'}}
            style={{color:'var(--accent-color)', fontSize:'36px', fontWeight:'400'}}
            formatDate={(date)=>moment(date).format('MMMM Do, YYYY')}
            />
        </span>
        <p className="day">{moment(date).format('dddd')}</p>
        <div className="filters">
          <IconMenu
            iconButtonElement={<RaisedButton className="filter-icon" buttonStyle={{backgroundColor:'transparent', color:'var(--accent-color)'}} labelStyle={{color:'var(--accent-color)'}} label="Airtimes" icon={<FontIcon className="material-icons" >filter_list</FontIcon>}></RaisedButton>}
            onChange={this.handleChange}
            value={filter}
            maxHeight={300}
          >
             <MenuItem value='' primaryText="All shows" />
             {
               times.map((time)=>{
                 return <MenuItem value={time.value} primaryText={time.formatted} key={time.value} />
               })
             }
           </IconMenu>
        </div>

      </header>
      {
        favorites.length > 0 ?
        <div className="favorites-container" style={{opacity:loading? 0:1, pointerEvents:loading? 'none':'auto'}}>
          <div className="filter-text-container"><h2 className="filter-text">Favorite shows</h2></div>
          <div className="favorites">
          {
            favorites.map((show)=>{
              return <div onClick={()=>props.changePage(show.show.id)} key={`${show.show.favorite_key}`}><ShowCard show={show.show} /></div>
            })
          }
          </div>
        </div>:''
      }
      <div className="filter-text-container" style={{opacity:loading? 0:1, pointerEvents:loading? 'none':'auto'}}>
        <h2 className="filter-text">{filterText}</h2>
        <nav className="filter-nav">
            <FloatingActionButton mini={true} onClick={()=>this.handleDateChange(null,prevDate)}>
              <FontIcon className="material-icons" >arrow_back</FontIcon>
            </FloatingActionButton>
            <FloatingActionButton mini={true} style={{marginLeft:'20px'}} onClick={()=>this.handleDateChange(null,nextDate)}>
              <FontIcon className="material-icons" >arrow_forward</FontIcon>
            </FloatingActionButton>
        </nav>
      </div>
      <nav className="floating-filter" ref={(elm)=>this.floatingNav = elm} style={{opacity:loading? 0.3:1, pointerEvents:loading? 'none':'auto'}}>
        <Paper zDepth={1} style={{backgroundColor:'var(--muted-color)'}}>
          <div className="float-date">
            <DatePicker
              container="inline"
              autoOk={true}
              name="date-picke-float"
              onChange={this.handleDateChange}
              value={date}
              textFieldStyle={{color:'var(--muted-font-color)', fontSize:'14px', fontWeight:'400', width:'100%'}}
              style={{color:'var(--muted-font-color)', fontSize:'14px', fontWeight:'400' ,width:"100%"}}
              formatDate={(date)=>moment(date).format('MM/DD/YYYY')}
            />
          </div>
          <List style={{maxHeight:'300px',overflow:'auto', color:'var(--muted-font-color)'}}>
            {
              timesList.map((time)=>{
                return time;
              })
            }
          </List>
        </Paper>
      </nav>
      <div className="home-content" style={{opacity:loading? 0:1, pointerEvents:loading? 'none':'auto'}}>
        {
          shows.map((show)=>{
            return <div onClick={()=>props.changePage(show.show.id)} key={show.id}><ShowCard removeFromFavorites={props.removeFromFavorites} addToFavorites={props.addToFavorites} show={show.show} overlay={true}  nav={true} user={user}/></div>
          })
        }
      </div>
      <Paper className="mobile" zDepth={2} style={{position:'fixed',bottom:0, zIndex:100, width:'100%', backgroundColor:'var(--muted-color)',color:'var(--muted-font-color)', padding:'0 20px'}}>
        <Toolbar>
          <ToolbarGroup firstChild={true}>
            <span className="date">
              <DatePicker
                container="dialog"
                autoOk={true}
                name="date-picker-mobile"
                onChange={this.handleDateChange}
                value={date}
                textFieldStyle={{color:'var(--muted-font-color)', fontSize:'16px', fontWeight:'300', width:'auto', height:'40px'}}
                style={{color:'var(--muted-font-color)', fontSize:'16px', fontWeight:'400'}}
                formatDate={(date)=>moment(date).format('MM/DD/YYYY')}
                />
            </span>
          </ToolbarGroup>
          <ToolbarGroup firstChild={true}>
            <IconMenu
              iconButtonElement={<RaisedButton className="filter-icon" buttonStyle={{backgroundColor:'transparent', color:'var(--muted-font-color)'}} labelStyle={{color:'var(--muted-font-color)'}} label="Airtimes" icon={<FontIcon className="material-icons" >filter_list</FontIcon>}></RaisedButton>}
              onChange={this.handleChange}
              value={filter}
              maxHeight={300}
              anchorOrigin={{horizontal: 'left', vertical: 'top'}}
              targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
            >
               <MenuItem value='' primaryText="All shows" />
               {
                 times.map((time)=>{
                   return <MenuItem value={time.value} primaryText={time.formatted} key={time.value} />
                 })
               }
             </IconMenu>
          </ToolbarGroup>
        </Toolbar>
      </Paper>
    </div>
  )
}

const setColors = ()=>{
  if(this.show && this.backgroundColor){
    this.setTimeOfDay(this.time_of_day);
    this.setBackGroundColor(this.backgroundColor);
    this.setBackGroundImage(this.show.image && this.show.image.original ? this.show.image.original : this.day_bg);
    changefontcolor('--accent-color',this.backgroundColor);
    changefontcolor('--muted-font-color',this.backgroundColor2);
    changeColorVar('--muted-color',this.backgroundColor2);
  }
}

const firstLoad = ()=>{
  this.image = undefined;
}

const mapStateToProps = state => ({
  times: state.home.times,
  shows: state.home.shows,
  favorites:state.home.favorites,
  time_of_day:state.home.time_of_day,
  backgroundColor:state.home.color,
  appBackground:state.app.backgroundColor,
  backgroundColor2:state.home.muted_color,
  filter: state.home.filter,
  date: state.home.date,
  body: state.app.body,
  loading: state.home.loading,
  user:state.app.user,
})

const mapDispatchToProps = dispatch => ({
  componentDidUpdate:()=>setColors(),
  componentWillMount:()=>firstLoad(),
  componentWillUnmount:()=>{this.scrollBody.removeEventListener('scroll',this.handleScroll,true)},
  ...bindActionCreators({
  componentDidMount:()=>getSchedule(this.filter,moment(this.date).format('YYYY-MM-DD')),
  getSchedule,
  setTimeOfDay,
  setBackGroundColor,
  setBackGroundImage,
  setFilter,
  setDate,
  addToFavorites,
  removeFromFavorites,
  changePage:(id)=> push(`/shows/${id}`),
}, dispatch)})

export default connectWithLifecycle(
  mapStateToProps,
  mapDispatchToProps
)(Home)
