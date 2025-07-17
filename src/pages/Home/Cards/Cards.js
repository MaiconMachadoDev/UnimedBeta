import React from 'react'

const Cards = ({ icon, title, value }) => {
  return (
    <div >
      <div >{icon}</div>
      <h2 >{title}</h2>
      <p >{value}</p>
    </div>
  );
};

export default Cards