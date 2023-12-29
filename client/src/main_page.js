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
    const [audioFile, setAudioFile] = useState(null);
    const fileInputRef = useRef(null);
    const waveformRef = useRef(null);
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
            const size = file.size / (1024 * 1024);
            if (size > 10) {
              document.getElementById("error").textContent = 'File size exceeds 10MB limit.';
              return;
            }
            setPred(null)
            document.getElementById("audioPlayer").src = URL.createObjectURL(file)
            document.querySelectorAll(".spect")[0].style.display = "none"
            document.querySelectorAll(".spectgrey")[0].style.display = "none"
            var canvasElem = document.getElementById('spectrogram-canvas');
            var canvasElemGrey = document.getElementById('spectrogram-canvas-grey');
            var ctx = canvasElem.getContext('2d');
            var ctx2 = canvasElemGrey.getContext('2d');
            // Clear the entire canvas
            ctx.clearRect(0, 0, canvasElem.width, canvasElem.height);
            ctx2.clearRect(0, 0, canvasElemGrey.width, canvasElemGrey.height);

         var reader = new FileReader();

     reader.onload = function() {

    var arrayBuffer = reader.result;

    wavSpectro.drawSpectrogram({arrayBuffer: arrayBuffer, canvasElem: canvasElem, cmap: 'jet'}, function () {
     document.querySelectorAll(".spect")[0].style.display = "block"
     
     
    });
    wavSpectro.drawSpectrogram({arrayBuffer: arrayBuffer, canvasElem: canvasElemGrey, cmap: 'bone'}, function () {
        document.querySelectorAll(".spectgrey")[0].style.display = "block"
    
    });

};

reader.readAsArrayBuffer(file);
            
            const formData = new FormData();
            document.querySelectorAll(".filename")[0].innerHTML = "File Name : "+file.name
            formData.append('audio_blob', file);
            if(document.querySelectorAll(".load")[0])document.querySelectorAll(".load")[0].style.display = "flex";
            const result = await axios.post("http://127.0.0.1:5000/upload",formData)
                console.log(result)
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
               <canvas className="specto" id="spectrogram-canvas"></canvas><p>Original Spectogram</p>
               </div>
               
               <div className="spectgrey">
                 <canvas className="specto-grey" id="spectrogram-canvas-grey"></canvas><p>Processesed Spectogram</p>
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