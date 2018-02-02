import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import {connectWithLifecycle} from 'react-lifecycle-component/lib'
import {getShow} from './modules/shows'
import {getBackGroundColor, setBackGroundImage, changefontcolor} from '../app/modules/app'
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


const Shows = (props) => {
  const {show, time_of_day, backgroundColor} = props;
  this.showid = props.match.params.id;
  this.show = show;
  this.time_of_day = time_of_day;
  this.getBackGroundColor = props.getBackGroundColor;
  this.setBackGroundImage = props.setBackGroundImage;
  this.backgroundColor = backgroundColor;

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

  this.active_season = seasons && seasons[0] && seasons[0].episodes ? seasons[0].episodes:[];
  console.log(this.active_season);
  return (
    _embedded && this.active_season ? <div className="show-container">
      <header className="show-header">
        <h1 className="show-name">{show.name}</h1>
        <p className="show-next-eps">{`Next episode: ${_embedded.nextepisode.name} | ${moment(_embedded.nextepisode.airstamp).format('MMMM Do, YYYY')}`}</p>
        <div className="show-current-season">
          Season {_embedded.nextepisode.season}
        </div>
      </header>
      <div className="show-content">
        <Table fixedHeader={true} wrapperStyle={{height:'100%'}} bodyStyle={{height:'calc(100% - 57px)'}}>
           <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}
           >
           <TableRow>
             <TableHeaderColumn style={{width:'100px'}}>#</TableHeaderColumn>
             <TableHeaderColumn>Episodes</TableHeaderColumn>
             <TableHeaderColumn style={{textAlign: 'center'}}>Date</TableHeaderColumn>
           </TableRow>
         </TableHeader>
         <TableBody displayRowCheckbox={false}>
            {
              this.active_season.map((eps)=>{
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
      </div>
    </div> : ''
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
  show: state.shows.show,
  backgroundColor:state.app.backgroundColor,
  time_of_day: state.app.time_of_day,
})

const mapDispatchToProps = dispatch => ({
  componentDidUpdate:()=>setColors(),
  //componentDidMount:() => firstLoad(),
  ...bindActionCreators({
  componentDidMount:()=> getShow(this.showid),
  getShow,
  getBackGroundColor,
  setBackGroundImage,
  changPage:(id)=> push(`/shows/${id}`),
}, dispatch)})

export default connectWithLifecycle(
  mapStateToProps,
  mapDispatchToProps
)(Shows)
