import React from 'react'
import PropTypes from 'prop-types';
import {connectWithLifecycle} from 'react-lifecycle-component/lib'
import './show-card.css';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import NO_IMAGE from '../../containers/app/images/no-image.png';




const ShowCard = props => {
  const {show} = props;
  const {image, name, network} = show;
  return (
    <div className="show-card-container">
      <Card className="show-card">
        <CardMedia
          overlay={<CardTitle title={name} subtitle={network ? network.name: 'No network'} />}
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
          <img src={image ? image.original:NO_IMAGE} alt="" />
        </CardMedia>
      </Card>
    </div>

  )
}


ShowCard.propTypes = {
  show: PropTypes.object.isRequired
};


export default ShowCard
