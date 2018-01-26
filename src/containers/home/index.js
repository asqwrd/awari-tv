import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import {connectWithLifecycle} from 'react-lifecycle-component/lib'
import {getSchedule, setTimeOfDay} from './modules/home'
import moment from 'moment'
import ShowCard from '../../components/show-card'


const Home = props => {
  const {schedule,time_of_day} = props;
  const {morning, latenight, midday, evening} = schedule;
  this.setTimeOfDay = props.setTimeOfDay;
  const shows = schedule[time_of_day];

  return (
    <div className="home-container">
      {
        shows ? shows.map((show)=>{
          return <ShowCard show={show.show} key={show.id}/>
        }):''
      }

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
}, dispatch)})

export default connectWithLifecycle(
  mapStateToProps,
  mapDispatchToProps
)(Home)
