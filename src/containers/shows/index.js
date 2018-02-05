import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import {connectWithLifecycle} from 'react-lifecycle-component/lib'
import {getShow, getSeason} from './modules/shows'
import {setBackGroundColor, setBackGroundImage, changefontcolor,changeColorVar} from '../app/modules/app'
import moment from 'moment'
import './shows.css'
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
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';



const Shows = (props) => {
  const {show, time_of_day, backgroundColor, backgroundColor2, active_season, episodes, body, loading,appBackground} = props;
  this.props = props;
  this.show = show;
  this.time_of_day = time_of_day;
  this.setBackGroundColor = props.setBackGroundColor;
  this.setBackGroundImage = props.setBackGroundImage;
  this.backgroundColor = backgroundColor;
  this.backgroundColor2 = backgroundColor2;
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

  const {_embedded } = show;
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
              return <div onClick={()=>props.getSeason(season)} className={`season-number ${active_season.number === season.number ? 'active':''}`} key={season.id}>{season.number}</div>
            })

          }
        </nav>
      </header>
      <nav className="floating-nav" ref={(elm)=>this.floatingNav = elm}>
        <Paper zDepth={1} style={{backgroundColor:'var(--muted-color)'}}>
          <List>
          <Subheader className="season-label" style={{textAlign:'center',padding:'0',color:`${appBackground}`}}>Seasons</Subheader>

          {
            show.seasons.map((season, index)=>{
              return <ListItem style={{textAlign:'center', color:'var(--muted-font-color)'}} onClick={()=>{props.getSeason(season); this.scrollBody.scrollTo(0,0)}} className={`season-number ${active_season.number === season.number ? 'active':''}`} key={season.id}>{season.number}</ListItem>
            })

          }
          </List>
        </Paper>

      </nav>
      <div className="show-content">
        <Paper style={{height:"100%", width:'100%', maxWidth:"1200px", backgroundColor:'var(--muted-color)',minHeight:'200px', display:'flex',alignItems:'center'}}>
          {
            episodes.length === 0 ? <h1 className="no-eps">No episodes</h1>:
            <Table fixedHeader={true}   style={{backgroundColor:'var(--muted-color)', color:'#fff'}}>
               <TableHeader
                  displaySelectAll={false}
                  adjustForCheckbox={false}
                  style={{backgroundColor:'transparent'}}
               >
               <TableRow style={{color:'var(muted-font-color)'}} displayBorder={false}>
                 <TableHeaderColumn style={{width:'100px',color:'var(muted-font-color)'}}>#</TableHeaderColumn>
                 <TableHeaderColumn style={{textAlign: 'left', color:'var(muted-font-color)'}}>Episodes</TableHeaderColumn>
                 <TableHeaderColumn style={{textAlign: 'center', color:'var(muted-font-color)'}}>Date</TableHeaderColumn>
               </TableRow>
             </TableHeader>
             <TableBody displayRowCheckbox={false}>
                {
                  episodes.map((eps)=>{
                    return (
                      <TableRow key={eps.id} style={{color:'var(muted-font-color)'}} displayBorder={false}>
                        <TableRowColumn style={{width:'100px'}}>{eps.number}</TableRowColumn>
                        <TableRowColumn>{eps.name}</TableRowColumn>
                        <TableRowColumn style={{textAlign: 'center'}}>{eps.airstamp ? moment(eps.airstamp).format('MMMM Do, YYYY') : 'No air date yet'}</TableRowColumn>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          }
        </Paper>
      </div>
    </div>
  )

}

const setColors = ()=>{
  if((this.show && this.backgroundColor && this.backgroundColor2)){
    this.show.image = this.show.image ? this.show.image: {original:this.day_bg}
    this.image = this.show.image.original;
    this.setBackGroundColor(this.backgroundColor);
    this.setBackGroundImage(this.show.image.original);
    changefontcolor('--accent-color',this.backgroundColor);
    changefontcolor('--muted-font-color',this.backgroundColor2);
    changeColorVar('--muted-color',this.backgroundColor2);
  }

}

const reloadPage = (nextprops)=>{
  if(this.props.match.params.id !== nextprops.match.params.id){
    this.props.getShow(nextprops.match.params.id)
  }
}



const mapStateToProps = state => ({
  show: state.shows.show,
  backgroundColor:state.shows.color,
  backgroundColor2:state.shows.muted_color,
  time_of_day: state.app.time_of_day,
  active_season: state.shows.active_season,
  episodes: state.shows.episodes,
  body:state.app.body,
  appBackground:state.app.backgroundColor,
  loading:state.shows.loading,
})

const mapDispatchToProps = dispatch => ({
  componentDidUpdate:()=>setColors(),
  componentWillReceiveProps:(nextprops)=>reloadPage(nextprops),
  componentWillUnmount:()=>this.scrollBody.removeEventListener('scroll',this.handleScroll,true),
  ...bindActionCreators({
  componentDidMount:()=>getShow(this.props.match.params.id),
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
