import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import {connectWithLifecycle} from 'react-lifecycle-component/lib'
import {getShow, getSeason} from './modules/shows'
import {setBackGroundColor, setBackGroundImage, changefontcolor} from '../app/modules/app'
import moment from 'moment'
import './shows.css'
import TV_IMAGE from '../app/images/tv_logo.svg';
import MIDDAY from '../app/images/midday.jpg';
import MORNING from '../app/images/morning.jpg';
import EVENING from '../app/images/evening.jpg';
import LATENIGHT from '../app/images/latenight.jpg';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import Paper from 'material-ui/Paper';
import RefreshIndicator from 'material-ui/RefreshIndicator';


import withinview from 'withinviewport/withinviewport'



const Shows = (props) => {
  const {show, time_of_day, backgroundColor, active_season, episodes, body, loading} = props;
  this.showid = props.match.params.id;
  this.show = show;
  this.time_of_day = time_of_day;
  this.setBackGroundColor = props.setBackGroundColor;
  this.setBackGroundImage = props.setBackGroundImage;
  this.backgroundColor = backgroundColor;
  this.scrollBody = body;
  this.handleScroll = (e)=>{
    if((this.seasonNav && this.scrollBody) && !withinview(this.seasonNav,{container:this.scrollBody, top:70})){
      this.floatingNav.classList.add('show');
    }else if(this.floatingNav){
      this.floatingNav.classList.remove('show');
    }
  }
  if(this.seasonNav && this.scrollBody)
  this.scrollBody.addEventListener('scroll', this.handleScroll,true)

  const {_embedded, seasons } = show;
  if(time_of_day == 'morning'){
    this.day_bg = MORNING;
  }else if(time_of_day == 'midday'){
    this.day_bg = MIDDAY;
  }else if(time_of_day == 'evening'){
    this.day_bg = EVENING;
  }else if(time_of_day == 'latenight'){
    this.day_bg = LATENIGHT;
  }

  return (

    <div className="show-container">
    <RefreshIndicator
        size={50}
        left={50}
        top={50}
        status={loading ? 'loading':'hide'}
        style={{position:'fixed',zIndex:1000, transform:'translate(-50%,-50%)', left:'50%', top:'50%'}}
      />
      <header className="show-header">
        <h1 className="show-name">{show.name}</h1>
        {_embedded.nextepisode ? <p className="show-next-eps">{`Next episode: ${_embedded.nextepisode.name} | ${moment(_embedded.nextepisode.airstamp).format('MMMM Do, YYYY')}`}</p>:_embedded.episodes && _embedded.episodes.length > 0 ? <p className="show-next-eps">{`Last episode: ${_embedded.episodes[_embedded.episodes.length - 1].name} | ${moment(_embedded.episodes[_embedded.episodes.length - 1].airstamp).format('MMMM Do, YYYY')}`}</p>:''}
        <div className="show-current-season">
          Season {_embedded.nextepisode ? _embedded.nextepisode.season:_embedded.episodes && _embedded.episodes.length > 0 ? _embedded.episodes[_embedded.episodes.length - 1].season:''}
        </div>
        <nav className='season-nav' ref={(elm)=>this.seasonNav = elm}>
          <h1 className="season-label">Seasons</h1>
          {
            show.seasons.map((season, index)=>{
              return <div onClick={()=>props.getSeason(season)} className={`season-number ${active_season.number == season.number ? 'active':''}`} key={season.id}>{season.number}</div>
            })

          }
        </nav>
      </header>
      <nav className="floating-nav" ref={(elm)=>this.floatingNav = elm}>
        <h1 className="season-label">Seasons</h1>
        {
          show.seasons.map((season, index)=>{
            return <div onClick={()=>{props.getSeason(season); this.scrollBody.scrollTo(0,0)}} className={`season-number ${active_season.number == season.number ? 'active':''}`} key={season.id}>{season.number}</div>
          })

        }
      </nav>
      <div className="show-content">
        <Paper style={{height:"100%", maxWidth:"1200px"}}>
          <Table fixedHeader={true}>
             <TableHeader
                displaySelectAll={false}
                adjustForCheckbox={false}
                style={{backgroundColor:'transparent'}}
             >
             <TableRow>
               <TableHeaderColumn style={{width:'100px'}}>#</TableHeaderColumn>
               <TableHeaderColumn style={{textAlign: 'center'}}>Episodes</TableHeaderColumn>
               <TableHeaderColumn style={{textAlign: 'center'}}>Date</TableHeaderColumn>
             </TableRow>
           </TableHeader>
           <TableBody displayRowCheckbox={false}>
              {
                episodes.map((eps)=>{
                  return (
                    <TableRow key={eps.id}>
                      <TableRowColumn style={{width:'100px'}}>{eps.number}</TableRowColumn>
                      <TableRowColumn>{eps.name}</TableRowColumn>
                      <TableRowColumn style={{textAlign: 'center'}}>{moment(eps.airstamp).format('MMMM Do, YYYY')}</TableRowColumn>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </Paper>
      </div>
    </div>
  )

}

const setColors = ()=>{
  if((this.show && this.backgroundColor)){
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

const reloadPage = (prevprops,nextprops)=>{
  if(prevprops.match.params.id !=prevprops.show.id){
    prevprops.getShow(prevprops.match.params.id)
  }
}



const mapStateToProps = state => ({
  show: state.shows.show,
  backgroundColor:state.shows.color,
  time_of_day: state.app.time_of_day,
  active_season: state.shows.active_season,
  episodes: state.shows.episodes,
  body:state.app.body,
  loading:state.shows.loading,
})

const mapDispatchToProps = dispatch => ({
  componentDidUpdate:()=>setColors(),
  componentWillReceiveProps:(prevprops,nextprops)=>reloadPage(prevprops,nextprops),
  componentWillUnmount:()=>this.scrollBody.removeEventListener('scroll',this.handleScroll,true),
  ...bindActionCreators({
  componentDidMount:()=>getShow(this.showid),
  getShow,
  setBackGroundColor,
  setBackGroundImage,
  getSeason,
  changePage:(id)=> push(`/shows/${id}`),
}, dispatch)})

export default connectWithLifecycle(
  mapStateToProps,
  mapDispatchToProps
)(Shows)
