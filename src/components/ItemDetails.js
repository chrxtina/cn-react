import React from 'react';

const ItemDetails = ( {match, data}) => {
  let item = data.find(item => item.id === match.params.itemId);
  let itemDetails;

  if (item) {
    itemDetails = <div>
      <h5> {item.name} </h5>
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
