import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import {connectWithLifecycle} from 'react-lifecycle-component/lib'
import {getSchedule, setFilter, setDate} from './modules/home'
import {getBackGroundColor, setBackGroundImage, changefontcolor, setTimeOfDay} from '../app/modules/app'
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
import DatePicker from 'material-ui/DatePicker';





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
  console.log(prevDate);


  return (
    <div className="home-container">
      <header className="home-header">
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
        <span className="nav-button prev" onClick={()=>this.handleDateChange(null,prevDate)}><button>Previous</button> <span>{moment(date).subtract('1','days').format('MMM Do, YYYY')}</span></span>
        <span className="nav-button next" onClick={()=>this.handleDateChange(null,nextDate)}><span>{moment(date).add('1','days').format('MMM Do, YYYY')}</span><button>Next</button></span>
      </header>
      <h2 className="filter-text">{filterText}</h2>
      <div className="home-content">
        {
          shows.map((show)=>{
            return <div onClick={()=>props.changPage(show.show.id)} key={show.id}><ShowCard show={show.show} /></div>
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

const mapStateToProps = state => ({
  times: state.home.times,
  shows: state.home.shows,
  time_of_day:state.app.time_of_day,
  backgroundColor:state.app.backgroundColor,
  filter: state.home.filter,
  date: state.home.date,
})

const mapDispatchToProps = dispatch => ({
  componentDidUpdate:()=>setColors(),
  ...bindActionCreators({
  componentWillMount:getSchedule,
  getSchedule,
  setTimeOfDay,
  getBackGroundColor,
  setBackGroundImage,
  setFilter,
  setDate,
  changPage:(id)=> push(`/shows/${id}`),
}, dispatch)})

export default connectWithLifecycle(
  mapStateToProps,
  mapDispatchToProps
)(Home)
