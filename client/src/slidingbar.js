import React, { useEffect, useState } from 'react';
import './SlidingBar.css';
import happy from "./happy.png"
import neutral from "./neutral.png"
import calm from "./calm.png"
import sad from "./sad2.png"
import fearful from "./fearful.png"
import disgust from "./disgust.png"
import surprised from "./surprised.png"
import angry from "./angry.png"

const options = [
    { label: 'Neutral', image: neutral },
    { label: 'Calmness', image: calm },
    { label: 'Happyness', image: happy},
    { label: 'Sadness', image: sad },
    { label: 'Angry', image: angry },
    { label: 'Fearful', image: fearful },
    { label: 'Disgust', image: disgust },
    { label: 'Surprised', image: surprised },
  ];

  const SlidingBar = (props) => {
    console.log(props.index)
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const handleSlide = (option) => {
      setSelectedOption(option);
    };
    useEffect(()=>{
  
      document.getElementById("point").style.width = "0%"
    },[])
    return (
      <div className="sliding-bar">
        <div className='emotions-div'>
        {options.map((option, index) => (
          <div
            key={index}
            id="select"
            className={`option ${selectedOption.label === option.label ? 'selected' : ''}`}
            onClick={() => handleSlide(option)}
          >
            <img style={{transition:"1s",animation:props.index && props.index.data > index ? "flash 5s":props.index.data == index?"static-flash 7s forwards":""}} src={option.image} alt={option.label} className="option-image emotion" />
            <span style={{fontWeight:props.index && props.index.data == index ? "700":"300"}}>{option.label}</span>
          </div>
        ))}
        </div>
        <div className="pointer" >
           <div id="point" style={{transition:"2s",width:`${props.index.data*10}%`,height:'100%'}}>

           </div>
           <div className="ball">

           </div>
        </div>
      </div>
    );
  };
  
  export default SlidingBar;