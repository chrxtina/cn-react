import React, { Component } from 'react';

class CountdownTimer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isExpired: this.props.isExpired,
      days: '',
      hours: '',
      minutes: '',
      seconds: ''
    };

    this.handleExpire = this.handleExpire.bind(this);
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  handleExpire() {
    this.setState({
      isExpired: true
    });
  }

  tick() {
    let startTime = this.props.startTime;
    let startTimeObj = new Date(startTime);
    let expireDate = startTimeObj;
    expireDate.setDate(startTimeObj.getDate() + 2);

    let countDownDate = expireDate.getTime();
    let now = new Date().getTime();
    let distance = countDownDate - now;

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0) {
      this.handleExpire();
      this.props.handleHasExpired();
      clearInterval(this.timerID);
    } else {
      this.setState( state => ({
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
      }));
    }
  }

  render () {
    return (
      <>
        {
          this.state.isExpired ? (
            <div>Item no longer active</div>
          ) : (
            <div>
              Time left: {
                this.state.days + "d " +
                this.state.hours + "h " +
                this.state.minutes + "m " +
                this.state.seconds + "s "
              }
            </div>
          )
        }
      </>
    )
  }
}

export default CountdownTimer;
