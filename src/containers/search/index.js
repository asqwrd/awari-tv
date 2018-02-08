import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import {connectWithLifecycle} from 'react-lifecycle-component/lib'
import {getSearch, addToFavorites, removeFromFavorites} from './modules/search'
import {setBackGroundColor, setBackGroundImage, changefontcolor, setTimeOfDay, changeColorVar} from '../app/modules/app'
import ShowCard from '../../components/show-card'
import './search.css'
import MIDDAY from '../app/images/midday.jpg';
import MORNING from '../app/images/morning.jpg';
import EVENING from '../app/images/evening.jpg';
import LATENIGHT from '../app/images/latenight.jpg';
import RefreshIndicator from 'material-ui/RefreshIndicator';


const Search = props => {
  const {shows, backgroundColor, time_of_day, body, loading,backgroundColor2, user} = props;
  this.backgroundColor = backgroundColor;
  this.backgroundColor2 = backgroundColor2;
  this.setBackGroundColor = props.setBackGroundColor;
  this.setBackGroundImage = props.setBackGroundImage;
  this.setTimeOfDay = props.setTimeOfDay;
  this.show = shows[0] ? shows[0]:null;
  this.time_of_day = time_of_day;
  this.search = props.match.params.query;
  this.scrollBody = body;

  this.scrollBody = body;
  if(time_of_day === 'morning'){
    this.day_bg = MORNING;
  }else if(time_of_day === 'midday'){
    this.day_bg = MIDDAY;
  }else if(time_of_day === 'evening'){
    this.day_bg = EVENING;
  }else if(time_of_day === 'latenight'){
    this.day_bg = LATENIGHT;
  }


  return (
    <div className="search-container">
      <RefreshIndicator
        size={50}
        left={50}
        top={50}
        status={loading ? 'loading':'hide'}
        style={{position:'fixed',zIndex:1000, transform:'translate(-50%,-50%)', left:'50%', top:'50%'}}
      />
      <header className="search-header" ref={(elm)=>this.searchHeader = elm} style={{opacity:loading? 0.3:1, pointerEvents:loading? 'none':'auto'}}>
        <span className="date">
          Search Results
        </span>
        <p className="day">{this.search}</p>
      </header>

      <div className="search-content" style={{opacity:loading? 0:1, pointerEvents:loading? 'none':'auto'}}>
        {
          shows.map((show)=>{
            return <div onClick={()=>props.changePage(show.id)} key={show.id}>
              <ShowCard show={show} overlay={true} nav={true} removeFromFavorites={props.removeFromFavorites} addToFavorites={props.addToFavorites} user={user}/>
            </div>
          })
        }
      </div>

    </div>
  )
}

const setColors = ()=>{
  if(this.show && this.backgroundColor){
    this.setTimeOfDay(this.time_of_day);
    this.setBackGroundColor(this.backgroundColor);
    this.setBackGroundImage(this.show.image && this.show.image.original ? this.show.image.original:this.day_bg);
    changefontcolor('--accent-color',this.backgroundColor);
    changefontcolor('--muted-font-color',this.backgroundColor2);
    changeColorVar('--muted-color',this.backgroundColor2);
  }

}

const reloadPage = (prevprops,nextprops)=>{
  if(prevprops.match.params.query !== this.search){
    prevprops.getSearch(prevprops.match.params.query)
  }
}

const mapStateToProps = state => ({
  shows: state.search.shows,
  time_of_day:state.search.time_of_day,
  backgroundColor:state.search.color,
  backgroundColor2:state.search.muted_color,
  body: state.app.body,
  loading: state.search.loading,
  user:state.app.user,
})

const mapDispatchToProps = dispatch => ({
  componentDidUpdate:()=>setColors(),
  componentWillReceiveProps:(prevprops,nextprops)=>reloadPage(prevprops,nextprops),
  ...bindActionCreators({
  componentDidMount:()=>getSearch(this.search),
  getSearch,
  setTimeOfDay,
  setBackGroundColor,
  setBackGroundImage,
  addToFavorites,
  removeFromFavorites,
  changePage:(id)=> push(`/shows/${id}`),
}, dispatch)})

export default connectWithLifecycle(
  mapStateToProps,
  mapDispatchToProps
)(Search)
