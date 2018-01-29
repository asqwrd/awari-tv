import React from 'react'
import PropTypes from 'prop-types';
import {connectWithLifecycle} from 'react-lifecycle-component/lib'
import './show-card.css';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';



const ShowCard = props => {
  const {show} = props
  return (
    <div className="show-card-container">
      <Card className="show-card">
        <CardMedia
          overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
          mediaStyle={
            {height: "100%",
            width: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0}
          }
        >
          <img src={show.image.original} alt="" />
        </CardMedia>
      </Card>
    </div>

  )
}


ShowCard.propTypes = {
  show: PropTypes.object.isRequired
};


export default ShowCard
