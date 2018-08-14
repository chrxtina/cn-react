import React from 'react';
import { Link, Route } from 'react-router-dom';
import ItemListing from './ItemListing';

class CategoryListing extends React.Component {
  state = {
    categories: [
      {
        name: 'books',
        id: '1',
        items: [
          {
            name: '1Q84',
            id: '2',
            description: 'Dolor sit amet',
            author: 'Haruki Murakami',
            location: '02139 '
          },
          {
            name: 'Harry Potter',
            id: '1',
            description: 'Lorem Ipsum',
            author: 'J.K. Rowling',
            location: '02139'
          },
          {
            name: 'Da Vinci Code',
            id: '3',
            description: 'Consectetur adipiscing elit',
            author: 'Dan Brown',
            location: '02125'
          }
        ]
      },
      {
        name: 'games',
        id: '2',
        items: [
          {
            name: 'Ticket to Ride',
            id: '4',
            description: 'Sed do eiusmod tempor',
            location: '02125'
          },
          {
            name: 'Monopoly',
            id: '5',
            description: 'Incididunt ut labore',
            location: '02139'
          },{
            name: 'Settlers of Cattan',
            id: '6',
            description: 'Excepteur sint occaecat',
            location: '02139'
          }
        ]
      }
    ]
  }

  render () {
    return (
      <div>
        <h3>Categories</h3>
        <ul>
          {
            this.state.categories.map( (category) => {
              return (
                <li key={category.id}>
                  <Link to={`${category.name}`}>
                    {category.name}
                  </Link>
                </li>
              )
            })
          }
        </ul>
        <Route path='/:category'
          render={ (props) => <ItemListing data= {this.state.categories} {...props} />} />
      </div>
    )
  }
}

export default CategoryListing;
