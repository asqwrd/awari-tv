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

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="date">{moment().format('MMMM Do, YYYY')}</h1>
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
  this.getBackGroundColor('http://static.tvmaze.com/uploads/images/original_untouched/13/34679.jpg');
  this.setBackGroundImage('http://static.tvmaze.com/uploads/images/original_untouched/13/34679.jpg');

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
