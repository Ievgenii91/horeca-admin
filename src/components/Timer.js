import React from 'react';

export default class Timer extends React.Component {
  constructor(props) {
    // TODO: from props.date count
    super(props);
    this.timer = null;
    this.state = {
      count: '05:00',
    };
  }

  startTimer(duration) {
    let timer = duration,
      minutes,
      seconds;
    this.timer = setInterval(() => {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      this.setState({ count: minutes + ':' + seconds });

      if (--timer < 0) {
        timer = duration;
      }
    }, 1000);
  }

  componentDidMount() {
    let fiveMinutes = 60 * 5;
    this.startTimer(fiveMinutes);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return <span className="pl-2 pt-2">{this.state.count}</span>;
  }
}
