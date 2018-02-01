import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import {connectWithLifecycle} from 'react-lifecycle-component/lib'
import {getSchedule, setTimeOfDay, setFilter} from './modules/home'
import {getBackGroundColor, setBackGroundImage, changefontcolor} from '../app/modules/app'
import moment from 'moment'
import ShowCard from '../../components/show-card'
import './home.css'
import TV_IMAGE from '../app/images/tv_logo.svg';
import MIDDAY from '../app/images/midday.jpg';
import MORNING from '../app/images/morning.jpg';
import EVENING from '../app/images/evening.jpg';
import LATENIGHT from '../app/images/latenight.jpg';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';





const Home = props => {
  const {shows, times, backgroundColor, time_of_day, filter, date} = props;
  this.backgroundColor = backgroundColor;
  this.getBackGroundColor = props.getBackGroundColor;
  this.setBackGroundImage = props.setBackGroundImage;
  this.setTimeOfDay = props.setTimeOfDay;
  this.show = shows[0] ? shows[0].show:null;
  this.time_of_day = time_of_day;
  if(time_of_day == 'morning'){
    this.day_bg = MORNING;
  }else if(time_of_day == 'midday'){
    this.day_bg = MIDDAY;
  }else if(time_of_day == 'evening'){
    this.day_bg = EVENING;
  }else if(time_of_day == 'latenight'){
    this.day_bg = LATENIGHT;
  }
  const time = times.filter(time=>time.value == filter);
  const filterText = time[0] ? time[0].formatted:'All shows';

  this.handleChange = (event, value)=>{
    props.getSchedule(value);
    props.setFilter(value);
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="date">{moment().format('MMMM Do, YYYY')}</h1>
        <p className="day">{moment().format('dddd')}</p>
        <div className="filters">
          <IconMenu
            iconButtonElement={<RaisedButton className="filter-icon" buttonStyle={{backgroundColor:'transparent', color:'var(--accent-color)'}} labelStyle={{color:'var(--accent-color)'}}label="Airtimes" icon={<FontIcon className="material-icons" >filter_list</FontIcon>}></RaisedButton>}
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
        <span className="nav-button prev"><button>Previous</button> <span>{moment().subtract('1','days').format('MMM Do, YYYY')}</span></span>
        <span className="nav-button next"><span>{moment().add('1','days').format('MMM Do, YYYY')}</span><button>Next</button></span>
      </header>
      <h2 className="filter-text">{filterText}</h2>
      <div className="home-content">
        {
          shows.map((show)=>{
            return <div onClick={()=>props.changPage(show.id)} key={show.id}><ShowCard show={show.show} /></div>
          })
        }
      </div>

    </div>
  )
}

const setColors = ()=>{
  if(this.show){
    this.show.image = this.show.image ? this.show.image: {original:this.day_bg}
    this.getBackGroundColor(this.show.image.original);
    this.setBackGroundImage(this.show.image.original);
    changefontcolor(this.backgroundColor);
  }
}

const firstLoad = ()=>{
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

const mapStateToProps = state => ({
  times: state.home.times,
  shows: state.home.shows,
  time_of_day:state.home.time_of_day,
  backgroundColor:state.app.backgroundColor,
  filter: state.home.filter,
  date: state.home.date,
})

const mapDispatchToProps = dispatch => ({
  componentDidUpdate:()=>setColors(),
  componentDidMount:() => firstLoad(),
  ...bindActionCreators({
  componentWillMount:getSchedule,
  getSchedule,
  setTimeOfDay,
  getBackGroundColor,
  setBackGroundImage,
  setFilter,
  changPage:(id)=> push(`/shows/${id}`),
}, dispatch)})

export default connectWithLifecycle(
  mapStateToProps,
  mapDispatchToProps
)(Home)
