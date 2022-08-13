import React from 'react';

const Card = (props) => {
  return (
    <div className="cards">
      <div className="cards__body">
        <img src={props.img} alt="post" />
      </div>
    </div>
  );
};

export default Card;
