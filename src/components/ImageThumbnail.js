import React, { Component } from "react";

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
      <span>
        <img src={this.props.image.url} alt="Preview" className="item-preview"/>
        <button type="button" onClick={this.deleteMessage}>X</button>
      </span>
    )
  }
}

export default ImageThumbnail;
