import React from 'react';
// import { Link, Route } from 'react-router-dom';

const ItemDetails = ( {match, data}) => {
  let item = data.find(c => c.id === match.params.itemId);
  console.log(item);
  let itemDetails;

  if (item) {
    itemDetails = <div>
      <h4> {item.name} </h4>
      <p> {item.description} </p>
      <p> {item.location} </p>
    </div>
  }

  return (
    <div>
        {itemDetails}
    </div>
  )
}

export default ItemDetails;
