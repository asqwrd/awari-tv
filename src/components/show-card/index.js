import React from 'react'
import PropTypes from 'prop-types';
import './show-card.css';
import {Card, CardMedia, CardTitle} from 'material-ui/Card';
import NO_IMAGE from '../../containers/app/images/no-image.png';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';




const ShowCard = props => {
  const {show, overlay, nav, user} = props;
  const {image, name, network, favorite, favorite_key} = show;
  this.handleClick = (e)=>{
    e.stopPropagation();
    console.log(user);
    if(user)
      props.addToFavorites(show,user.uid);
  }
  this.handleRemoveClick = (e)=>{
    e.stopPropagation();
    if(user && favorite_key)
      props.removeFromFavorites(show,user.uid,favorite_key);
  }
  return (
    <div className="show-card-container">
      {
        nav ? <nav className='show-nav'>
          {
            favorite ? <IconButton tooltip="Unfavorite show" onClick={this.handleRemoveClick}>
              <FontIcon className="material-icons" color={'#fff'}>favorite</FontIcon>
            </IconButton>:<IconButton tooltip="Favorite show" onClick={this.handleClick}>
              <FontIcon className="material-icons" color={'#fff'}>favorite_border</FontIcon>
            </IconButton>
          }
        </nav>:''
      }
      <Card className="show-card">
        <CardMedia
          overlay={overlay ? <CardTitle title={name} subtitle={network ? network.name: 'No network'} />:false}
          mediaStyle={
            {
              height: "100%",
              width: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0
            }
          }
          overlayContentStyle={
            {
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace:'nowrap',
              lineHeight:1,
              fontSize:'18px'
            }
          }
        >
          <img src={image && image.original ? image.original:NO_IMAGE} alt="" />
        </CardMedia>
      </Card>
    </div>

  )
}


ShowCard.propTypes = {
  show: PropTypes.object.isRequired,
  overlay:PropTypes.bool,
  nav:PropTypes.bool,
  addToFavorites:PropTypes.func,
  removeFromFavorites:PropTypes.func,
  user:PropTypes.object,
};


export default ShowCard
