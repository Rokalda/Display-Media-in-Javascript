

const streamTypes= {screen:"SCREEN",camera:"CAMERA"}

const dp_btn=document.querySelector(".dp_btn")
const cam_btn = document.querySelector(".cam_btn")
const media_container = document.querySelector(".media_container")
const vid_checkbox=document.getElementById("video")
const audio_checkbox=document.getElementById("audio");

vid_checkbox.onchange=checkifanyChecked
audio_checkbox.onchange=checkifanyChecked

function checkifanyChecked(){
if(vid_checkbox.checked || audio_checkbox.checked){
  cam_btn.disabled=false;
}
else{
  cam_btn.disabled=true;
}
}
// Ininitializing an Array to keeo track of all The Media Streams being recorded.

dp_btn.onclick=async ()=>{
  await addVideotoStream(streamTypes.screen);

}
cam_btn.onclick=async ()=>{
await addVideotoStream(streamTypes.camera);
}

async function addVideotoStream(str_type)  {
    
  let videoStream;
  if(str_type==streamTypes.screen){
    videoStream= await startDisplayCapture(displayMediaOptions);
  }
  else if(str_type==streamTypes.camera){
    videoStream= await startCameraCapture();
  }
 ;

   if (videoStream==null){
      return;
   }
   else{
     const date = new Date()
     let videoTrack=videoStream.getVideoTracks()[0];
     let audioTrack = videoStream.getAudioTracks()[0];
     let streamDisplayName="";
     if(videoTrack==null){
      
      streamDisplayName="Microhone"
     }
     else if(str_type==streamTypes.camera){
      streamDisplayName="Camera"
     }
     else if("getCapabilities" in videoTrack){
        
      
          streamDisplayName= videoTrack.getCapabilities().displaySurface;
        
     }
     else{
       streamDisplayName="Screen";
     }
    
     
     
       const recorder = new MediaRecorder(videoStream)
      
       let recordedData=[]
       recorder.ondataavailable=(event)=>{
         
         recordedData.push(event.data)
         
       
         
       }
       // Start Recording before displaying the video to the user
    
       recorder.start()
       // Creating The Media Display Element to serve as an Interface for this Video 

       const media_display=document.createElement("div");
       media_display.className="media_display";
       media_display.dataset.videoId=videoStream.id;
       

       media_display.innerHTML=`	
       <video class="media_screen" muted autoplay ></video>
       <p class="media_title">${streamDisplayName.toUpperCase()} Recording at ${date.toLocaleDateString()} ${date.toLocaleTimeString()}</p>
       <a class="streaming">Streaming</a>`
       
       const media_screen= media_display.querySelector(".media_screen")
       
       const link= media_display.querySelector("a")
     
       
     
       link.onclick=()=>{
         let tracks = videoStream.getTracks()
         for(let i =0;i<tracks.length;i++){
           tracks[i].stop()
         }
       }
       
      
       media_screen.srcObject=videoStream;
       media_container.appendChild(media_display)
       media_display.scrollIntoView({behavior:"smooth"})
       
       
       recorder.onstop=()=>{
         
       
             link.className="download_link";
             link.textContent="Download Recording";

             const blob = new Blob(recordedData,{type:"video/mp4"})
             let dateString = date.toLocaleDateString().split("/").join("_")
             let timeString = date.toLocaleTimeString().split(":").join("_")
             let mediaUrl=URL.createObjectURL(blob);
            media_screen.srcObject=null;
            media_screen.src=mediaUrl;
           media_screen.controls=true;
            let video_filename=`${streamDisplayName}Recording_${dateString}-${timeString}.mp4`;
         
             link.href=mediaUrl;
            link.download=video_filename;
       }
       

       // This is run when the User stops Sharing their monitor
       if(videoTrack!=null){
        videoTrack.onended=endRecording
       }
       else{
        audioTrack.onended=endRecording
       }
     
     function endRecording(){
        
          link.onclick=null;
          recorder.stop()
     }
   }

}



const displayMediaOptions = {
    video: {
      displaySurface: "browser",
      
    },
    audio: {
      suppressLocalAudioPlayback: false,
    },
    preferCurrentTab: false,
    selfBrowserSurface: "include",
    systemAudio: "include",
    surfaceSwitching: "include",
    monitorTypeSurfaces: "include",
    
  };

  
  
  async function startDisplayCapture(displayMediaOptions) {
    let captureStream;
  
    try {
      captureStream =
        await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    } catch (err) {
      console.error(`Error: ${err}`);
    }
    return captureStream;
  }
  
async function startCameraCapture(){
  let cap_stream;
  try {
    cap_stream = await navigator.mediaDevices.getUserMedia({video:vid_checkbox.checked,audio:audio_checkbox.checked});
  } catch (err) {
    console.error(`Error: ${err}`);
  }
  return cap_stream;
}


