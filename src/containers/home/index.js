import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import {connectWithLifecycle} from 'react-lifecycle-component/lib'
import {getSchedule, setFilter, setDate} from './modules/home'
import {setBackGroundColor, setBackGroundImage, changefontcolor, setTimeOfDay} from '../app/modules/app'
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
import FloatingActionButton from 'material-ui/FloatingActionButton';
import withinview from 'withinviewport/withinviewport'
import RefreshIndicator from 'material-ui/RefreshIndicator';






const Home = props => {
  const {shows, times, backgroundColor, time_of_day, filter, date, body, loading} = props;
  this.backgroundColor = backgroundColor;
  this.setBackGroundColor = props.setBackGroundColor;
  this.setBackGroundImage = props.setBackGroundImage;
  this.setTimeOfDay = props.setTimeOfDay;
  this.show = shows[0] ? shows[0].show:null;
  this.time_of_day = time_of_day;
  this.date = date;
  this.filter = filter;

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
  this.scrollBody = body;
  this.handleScroll = (e)=>{
    if((this.homeHeader && this.scrollBody) && !withinview(this.homeHeader,{container:this.scrollBody, top:70})){
      this.floatingNav.classList.add('show');
    }else if(this.floatingNav){
      this.floatingNav.classList.remove('show');
    }
  }
  if(this.scrollBody.addEventListener)
  this.scrollBody.addEventListener('scroll',this.handleScroll,true)

  return (
    <div className="home-container">
      <RefreshIndicator
        size={50}
        left={50}
        top={50}
        status={loading ? 'loading':'hide'}
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
      <nav className="floating-filter" ref={(elm)=>this.floatingNav = elm}>
        <IconMenu
          iconButtonElement={<RaisedButton className="filter-icon" buttonStyle={{backgroundColor:'transparent', color:'var(--accent-color)'}} labelStyle={{color:'var(--accent-color)'}} label="Airtimes" icon={<FontIcon className="material-icons" style={{color:'var(--accent-color)', margin:0}} >filter_list</FontIcon>}></RaisedButton>}
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
         <DatePicker
           container="inline"
           autoOk={true}
           name="date-picke-float"
           onChange={this.handleDateChange}
           value={date}
           textFieldStyle={{color:'var(--accent-color)', fontSize:'18px', fontWeight:'400', width:'100%'}}
           style={{color:'var(--accent-color)', fontSize:'18px', fontWeight:'400' ,width:"100%"}}
           formatDate={(date)=>moment(date).format('MM/DD/YYYY')}
           />
      </nav>
      <div className="home-content" style={{opacity:loading? 0:1, pointerEvents:loading? 'none':'auto'}}>
        {
          shows.map((show)=>{
            return <div onClick={()=>props.changePage(show.show.id)} key={show.id}><ShowCard show={show.show} /></div>
          })
        }
      </div>

    </div>
  )
}

const setColors = ()=>{
  if(this.show && this.backgroundColor){
    this.setTimeOfDay(this.time_of_day);
    this.show.image = this.show.image ? this.show.image: {original:this.day_bg}
    this.image = this.show.image.original;
    this.setBackGroundColor(this.backgroundColor);
    this.setBackGroundImage(this.show.image.original);
    changefontcolor(this.backgroundColor);
  }
}

const firstLoad = ()=>{
  this.image = undefined;
}

const mapStateToProps = state => ({
  times: state.home.times,
  shows: state.home.shows,
  time_of_day:state.home.time_of_day,
  backgroundColor:state.home.color,
  filter: state.home.filter,
  date: state.home.date,
  body: state.app.body,
  loading: state.home.loading,
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
  changePage:(id)=> push(`/shows/${id}`),
}, dispatch)})

export default connectWithLifecycle(
  mapStateToProps,
  mapDispatchToProps
)(Home)
