import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Dropdown } from 'semantic-ui-react';

class CategorySelect extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedOption: null
    };
  }

  handleChange = (e, data) => {
    console.log(data.value);
    this.setState({ selectedOption: data.value }, function(){
      this.props.setSelectedOption(this.state.selectedOption);
    });
  };

  render () {

    let options = [];

    if (this.props.allCategoriesQuery.loading) {
      return (<Dropdown text='Dropdown' options={options} loading />)
    }

    this.props.allCategoriesQuery.allCategories && this.props.allCategoriesQuery.allCategories.map(category => {
      let categoryOption = {
        key: category.id,
        text: category.name,
        value: category.name
      }
      return options.push(categoryOption);
    })

    return (
      <>
        <Dropdown placeholder='Filter by category'
          fluid
          multiple
          selection
          clearable
          search
          options={options}
          onChange={this.handleChange}
        />
      </>
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
