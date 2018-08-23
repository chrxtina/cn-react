import React, { Component } from 'react';

class NewItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
        category: "",
        name: "",
        desc: "",
        location: ""
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
  }

  render() {
    return (
      <div className="new-item">
        <form onSubmit={this.handleSubmit}>
          <label>
            Category:
            <select
              name="category"
              value={this.state.category}
              onChange={this.handleInputChange}>
                <option value="books">Books</option>
                <option value="games">Games</option>
            </select>
          </label>
          <label>
            Name:
            <input
              name="name"
              type="text"
              value={this.state.name}
              onChange={this.handleInputChange}
            />
          </label>
          <label>
            Description:
            <textarea
              name="desc"
              value={this.state.desc}
              onChange={this.handleInputChange}
            />
          </label>
          <label>
            Location:
            <input
              name="location"
              type="text"
              value={this.state.location}
              onChange={this.handleInputChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default NewItem;
