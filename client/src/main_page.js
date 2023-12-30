import {React,useEffect,useState,useRef} from 'react';
import { ReactDOM } from "react";
import  wavSpectro from 'wav-spectrogram';


import logo from "./logo3.png"
import "./main.css"
import axios from "axios"
import happy from "./happy.png"
import neutral from "./neutral.png"
import calm from "./calm.png"
import sad from "./sad2.png"
import fearful from "./fearful.png"
import disgust from "./disgust.png"
import surprised from "./surprised.png"
import angry from "./angry.png"
import SlidingBar from './slidingbar';





export default function Main_page(){
    const [audioFile, setAudioFile] = useState(null)
    const fileInputRef = useRef(null)
    const waveformRef = useRef(null)
    const [pred,setPred] = useState()
    const [logos,setLogo] = useState([neutral,calm,happy,sad,angry,fearful,disgust,surprised])
    const [emotion,setEmo] = useState(['Neutral','Calmness','Happyness','Sadness','Angry','Fearful','Disgust','Surprised'])
    const handleButtonClick = () => {
        
        fileInputRef.current.click();
      };



      


      useEffect(()=>{

       
    
          
      
          
        document.getElementById("audioInput").addEventListener('change', async (e) => {
       
            const file = e.target.files[0];
            if(!file)return;
            document.getElementById("error").innerHTML = ""
            const size = file.size / (1024 * 1024);
            if (size > 10) {
              document.getElementById("error").textContent = 'File size exceeds 10MB limit.';
              return;
            }

            const container1 = document.querySelectorAll(".spect")[0];
            const container2 = document.querySelectorAll(".spectgrey")[0];
            const canvasToRemove = document.querySelector('.specto'); 
            const canvasToRemove2 = document.querySelector('.specto-grey'); 


if (canvasToRemove) {
   
    const parentContainer = canvasToRemove.parentNode;

    parentContainer.removeChild(canvasToRemove);
}
if (canvasToRemove2) {
   
  const parentContainer = canvasToRemove2.parentNode;

  parentContainer.removeChild(canvasToRemove2);
}
            setPred(null)
            document.getElementById("audioPlayer").src = URL.createObjectURL(file)
            document.querySelectorAll(".spect")[0].style.display = "none"
            document.querySelectorAll(".spectgrey")[0].style.display = "none"
            const canvas = document.createElement('canvas');
    
            canvas.width = 400;  
            canvas.height = 200; 
        
           
            canvas.classList.add('specto');

            const canvasGrey = document.createElement('canvas');
    
            canvasGrey.width = 400;  
            canvasGrey.height = 200; 
        
          
            canvasGrey.classList.add('specto-grey');

            

            const ctx = canvas.getContext('2d');
            const ctx2 = canvas.getContext('2d');
            

         var reader = new FileReader();

     reader.onload = function() {

    let arrayBuffer = reader.result;
   
    wavSpectro.drawSpectrogram({arrayBuffer: reader.result, canvasElem: canvas, cmap: 'jet'}, function () {
      container1.appendChild(canvas);
      container1.style.display = "block"
     
     
    });
    
    wavSpectro.drawSpectrogram({arrayBuffer: reader.result, canvasElem: canvasGrey, cmap: 'bone'}, function () {
      container2.appendChild(canvasGrey);
      container2.style.display = "block"
    
    });

};

reader.readAsArrayBuffer(file);
            
            const formData = new FormData();
            document.querySelectorAll(".filename")[0].innerHTML = "File Name : "+file.name
            formData.append('audio_blob', file);
            if(document.querySelectorAll(".load")[0])document.querySelectorAll(".load")[0].style.display = "flex";
            axios.post("https://6fd9-103-101-213-212.ngrok-free.app/upload",formData)
            .then(result =>{
              if(result.data){
                   
                console.log(audioFile)
                setTimeout(()=>{
                    console.log(audioFile)
                },1000)
                console.log(result.data.data)
                setPred(result.data)
               
                setTimeout(()=>{
                    document.getElementById("point").style.width = result.data.data*15+"%";
                },500)

            }
            }
                
            )
            .catch(err =>{
                document.getElementById("error").innerHTML = "The Flask API is currently under maintainence and will be up and active in a few hours"
            })
               
               
        })

       
      },[])
    return(
        <div className="cont">
           <div className="navbar">
              <img src={logo} style={{width:"140px",height:"auto",margin:"1%"}}></img>
              <div className="descp">
                 <h4> Range of Emotions</h4>
                 <p style={{fontSize:"80%"}}> <span style={{color:"#B22B27"}}>&#x2022;</span> Neutral </p>
                 <p style={{fontSize:"80%"}}> <span style={{color:"#B22B27"}}>&#x2022;</span> Calm </p>
                 <p style={{fontSize:"80%"}}> <span style={{color:"#B22B27"}}>&#x2022;</span> Happy </p>
                 <p style={{fontSize:"80%"}}> <span style={{color:"#B22B27"}}>&#x2022;</span> Sad </p>
                 <p style={{fontSize:"80%"}}> <span style={{color:"#B22B27"}}>&#x2022;</span> Angry </p>
                 <p style={{fontSize:"80%"}}> <span style={{color:"#B22B27"}}>&#x2022;</span> Fearful </p>
                 <p style={{fontSize:"80%"}}> <span style={{color:"#B22B27"}}>&#x2022;</span> Disgust</p>
                 <p style={{fontSize:"80%"}}> <span style={{color:"#B22B27"}}>&#x2022;</span> Surprised </p>
                   <br></br>
                 
              </div>
           </div>
           <div className="cont2">

          
         
           
   
                <button onClick={handleButtonClick} htmlFor="audioInput" className="import_audio">Import Audio</button>
                <p id="error"></p>
                <p className="filename"></p>
                <audio id="audioPlayer" controls ></audio>
  
                <input ref={fileInputRef} name="audio_file" type="file" id="audioInput" accept=".mp3, .wav, .ogg" style={{display:'none'}}></input>
                

               
             
               <div className="specto-images">

               <div className="spect">
               <p>Original Spectogram</p>
               </div>
               
               <div className="spectgrey">
                 <p>Processesed Spectogram</p>
               </div>
             </div>
            
              
           {
             !pred?
             <div className="load">
               Loading
            </div>
                :
            <div className="prediction">
               <h4>SPEECH EMOTION DETECTED</h4>
                <SlidingBar
                  
                  index = {pred}
                  
                />
            </div>
           }
            </div>
        </div>
    )
}