import React, { Component } from 'react';
import Select from 'react-select';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class CategorySelect extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedOption: null
    };
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption }, function(){
      this.props.setSelectedOption(this.state.selectedOption);
    });
  };

  render () {
    const { selectedOption } = this.state;

    if (this.props.allCategoriesQuery.loading) {
      return (<div>Loading</div>)
    }

    let options = [];

    this.props.allCategoriesQuery.allCategories && this.props.allCategoriesQuery.allCategories.map(category => {
      let categoryOption = {
        value: category.name,
        label: category.name
      }
      return options.push(categoryOption);
    })

    return (
      <div>
        <Select
          value={selectedOption}
          onChange={this.handleChange}
          options={options}
          isMulti
        />
      </div>
    )
  }
}

const ALL_CATEGORIES_QUERY = gql`
  query AllCategoriesQuery {
    allCategories(orderBy: name_ASC) {
      id
      name
    }
  }
`;

export default graphql(ALL_CATEGORIES_QUERY, {
  name: 'allCategoriesQuery'
})(CategorySelect);
