import React from 'react'
import PropTypes from 'prop-types';
import './show-card.css';
import {Card, CardMedia, CardTitle} from 'material-ui/Card';
import NO_IMAGE from '../../containers/app/images/no-image.png';




const ShowCard = props => {
  const {show, overlay} = props;
  const {image, name, network} = show;
  return (
    <div className="show-card-container">
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
};


export default ShowCard
