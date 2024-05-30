


const dp_btn=document.querySelector(".dp_btn")

const video_container = document.querySelector(".video_container")

// Ininitializing an Array to keeo track of all The Media Streams being recorded.

dp_btn.addEventListener("click",async ()=>{
    
    
   let videoStream= await startCapture(displayMediaOptions);

    if (videoStream==null){
   
    }
    else{
      const date = new Date()
      let videoTrack=videoStream.getVideoTracks()[0];
      let streamDisplayName="";
      if("getCapabilities" in videoTrack){
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
        video_container.appendChild(media_display)
        media_display.scrollIntoView({behavior:"smooth"})
        
        
        recorder.onstop=()=>{
          
          const dl=document.querySelector(".media_display[data-video-id='"+recorder.stream.id+"']").querySelector("a")
              dl.className="download_link";
              dl.textContent="Download Recording";

              const blob = new Blob(recordedData,{type:"video/mp4"})
              let dateString = date.toLocaleDateString().split("/").join("_")
              let timeString = date.toLocaleTimeString().split(":").join("_")
             
             let video_filename=`${streamDisplayName}Recording_${dateString} ${timeString}.mp4`
          
              dl.href=URL.createObjectURL(blob);
             dl.download=video_filename;
        }

        // This is run when the User stops Sharing their monitor
        
         videoTrack.onended=()=>{
          link.onmouseenter=null;
          link.onmouseleave=null;
          link.onclick=null;
          recorder.stop()
          // video_container.querySelectorAll(".media_display").forEach((md)=>{
          //   if(md.dataset.videoId==videoStream.id){
          //     recorder.stop()
              
          //   }
          // })
         
        }
      
    }

})




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
  
  async function startCapture(displayMediaOptions) {
    let captureStream;
  
    try {
      captureStream =
        await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    } catch (err) {
      console.error(`Error: ${err}`);
    }
    return captureStream;
  }
  

