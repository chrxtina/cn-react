import React, { Component } from "react";
import { Button } from 'semantic-ui-react';

class ImageThumbnail extends Component {

  constructor(props) {
    super(props);
    this.deleteMessage = this.deleteMessage.bind(this);
  }

  deleteMessage() {
    this.props.onDeleteImage(this.props.image.id, this.props.index);
  }

  render() {
    return(
      <span className="img-thumbnail">
        <img src={this.props.image.url}
          alt="Preview"
          className="item-preview"
        />
        <Button
          icon='delete'
          size='mini'
          negative
          onClick={this.deleteMessage}
          className='img-delete-btn'
        />
      </span>
    )
  }
}

export default ImageThumbnail;
