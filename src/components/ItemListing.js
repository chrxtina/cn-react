import React from 'react';
import ItemDetails from './ItemDetails';
import { Link, Route } from 'react-router-dom';

const ItemListing = ( {match, data}) => {
  let category = data.find(c => c.name === match.params.category);
  let categoryItems;

  if (category) {
    categoryItems = category.items.map( (item) => {
      return (
        <li key={item.id}>
          <Link to={`${match.url}/${item.id}`}>
            {item.name}
          </Link>
        </li>
      )
    })
  }

  return (
    <div>
      <ul>
        {categoryItems}
      </ul>
      <Route path='/:category/:itemId'
        render={ (props) => <ItemDetails data= {category.items} {...props} />} />
    </div>
  )
}

export default ItemListing;
