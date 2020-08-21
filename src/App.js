import React, { Component } from 'react';
import ActionCable from 'actioncable';
import './App.css';

class App extends Component {
  state = {
    text: '',
    items: []
  }

  componentDidMount() {
    const cable = ActionCable.createConsumer('ws://localhost:3001/cable')

    this.sub = cable.subscriptions.create('TrackingsChannel', {
      received: this.handleReceiveNewText
    })

    // window.fetch('http://localhost:3001/api/v1/tracking_cable').then(
    //   data => {
    //     data.json().then(
    //       res => {
    //         this.setState({
    //           text: res.text
    //         })
    //       })
    //   })
  }

  handleChange = e => {
    this.setState({ text: e.target.value })
    // this.sub.send({ text: e.target.value, id: 1 })
  }

  handleReceiveNewText = (data) => {

    this.setState({
      items: [...this.state.items, data.details]
    })
    console.log("data ",data)
  }

  handleClick = e => {
    e.preventDefault()
    this.setState({
      items: []
    })

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guias: this.state.text })
    };
    fetch('http://localhost:3001/api/v1/tracking', requestOptions)
      .then(response => console.log(response))
  }

  render() {
    return (
      <div>
        <h1>Rastreo de guias</h1>
        <textarea
          value={this.state.text}
          onChange={this.handleChange}
        />
        <br/>
        <button onClick={this.handleClick}>Rastrear</button>
        <div>
          <h1>Resultado</h1>
          {
            this.state.items.map(guia => (
              <div className="guia">
                <span><b>Guia:</b> {guia.tracking_number}</span>
                <br />
                <span><b>Detalles:</b></span>
                <ul>
                  {
                    Array.isArray(guia.details) ?
                      guia.details.map(detalle => (
                          <li>{detalle.description}</li>
                        )
                      )
                    :
                    <li className="exception">{guia.details || guia.error}</li>
                  }
                </ul>
              </div>
            ))
          }
          <div>

          </div>
        </div>
      </div>
    )
  }
}

export default App;
