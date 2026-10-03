import React, { useEffect, useRef, useState } from "react";
import "../index.css";

const MeetingLayout = () => {
  const videoRef = useRef(null);
  const [myStream, setMyStream] = useState(null);

  useEffect(() => {
    const startLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        console.log("Stream obtained:", stream);
        console.log("Video tracks:", stream.getVideoTracks());

        setMyStream(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera/Microphone error:", error);
      }
    };

    startLocalStream();

    return () => {
      if (myStream) {
        myStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="meet">
      <div className="meet-stage">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          width="500"
          height="300"
        />

        {!myStream && <p>Waiting for camera...</p>}
      </div>
    </div>
  );
};

export default MeetingLayout;