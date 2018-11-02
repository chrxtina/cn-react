import React, { Component } from 'react';

class CountdownTimer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      days: '',
      hours: '',
      minutes: '',
      seconds: ''
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnMount() {
    clearInterval(this.timerID);
  }

  tick() {
    let createdAt = this.props.createdAt;
    let createdAtObj = new Date(createdAt);
    let expireDate = createdAtObj;
    expireDate.setDate(createdAtObj.getDate() + 2);

    let countDownDate = expireDate.getTime();
    let now = new Date().getTime();
    let distance = countDownDate - now;

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0) {
      this.props.handleExpire();
      clearInterval(this.timerID);
    } else {
      this.setState({
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
      });
    }
  }

  render () {
    return (
      <div>
        Time left: {this.state.days + "d " + this.state.hours + "h " + this.state.minutes + "m " + this.state.seconds + "s "}
      </div>
    )
  }
}

export default CountdownTimer;
