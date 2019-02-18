import React, { Component } from 'react';

class Message extends Component {

  render () {
    return (
      <div className={ this.props.currentUserId === this.props.ownerId ? "align-right" : "" }>
        <div>{this.props.message.text}</div>
        <div>{this.props.message.createdAt}</div>
      </div>
    )
  }
}

export default Message;
