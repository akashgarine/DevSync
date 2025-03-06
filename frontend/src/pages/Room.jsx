import React from 'react'

const Room = () => {
    function display(){
        console.log(localStorage.getItem('roomCode'));
    }
  return (
    <div>
        <button onClick={display}>Button</button>
    </div>
  )
}

export default Room