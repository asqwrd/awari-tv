import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import {connectWithLifecycle} from 'react-lifecycle-component/lib'
import {getSchedule, setTimeOfDay} from './modules/home'
import {getBackGroundColor, setBackGroundImage} from '../app/modules/app'
import moment from 'moment'
import ShowCard from '../../components/show-card'
import './home.css'


const Home = props => {
  const {schedule,time_of_day} = props;
  const {morning, latenight, midday, evening} = schedule;
  this.setTimeOfDay = props.setTimeOfDay;
  this.getBackGroundColor = props.getBackGroundColor;
  this.setBackGroundImage = props.setBackGroundImage;
  const shows = schedule[time_of_day] ? schedule[time_of_day]:[];
  this.show = shows[0] && shows[0].show ? shows[0].show:null;
  if(this.show){
    this.getBackGroundColor(this.show.image.original);
    this.setBackGroundImage(this.show.image.original);
  }


  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="date">{moment().format('MMMM Do, YYYY')}</h1>
        <nav className="time-of-day-nav">
          <div className={`time-of-day ${time_of_day === 'morning' ? 'active':''}`} onClick={()=>props.setTimeOfDay('morning')}>Morning</div>
          <div className={`time-of-day ${time_of_day === 'midday' ? 'active':''}`} onClick={()=>props.setTimeOfDay('midday')}>Mid-Day</div>
          <div className={`time-of-day ${time_of_day === 'evening' ? 'active':''}`} onClick={()=>props.setTimeOfDay('evening')}>Evening</div>
          <div className={`time-of-day ${time_of_day === 'latenight' ? 'active':''}`} onClick={()=>props.setTimeOfDay('latenight')}>Late night</div>
        </nav>
        <p className="day">{moment().format('dddd')}</p>

        <span className="nav-button prev"><button>Previous</button> <span>{moment().subtract('1','days').format('MMM Do, YYYY')}</span></span>
        <span className="nav-button next"><span>{moment().add('1','days').format('MMM Do, YYYY')}</span><button>Next</button></span>
      </header>
      <div className="home-content">
        {
          shows.map((show)=>{
            return <ShowCard show={show.show} key={show.id}/>
          })
        }
      </div>

    </div>
  )
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
  schedule: state.home.schedule,
  time_of_day:state.home.time_of_day,
})

const mapDispatchToProps = dispatch => ({
  componentDidMount:() => firstLoad(),
  ...bindActionCreators({
  componentWillMount:getSchedule,
  getSchedule,
  setTimeOfDay,
  getBackGroundColor,
  setBackGroundImage,
}, dispatch)})

export default connectWithLifecycle(
  mapStateToProps,
  mapDispatchToProps
)(Home)
