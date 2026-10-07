import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../Context/SocketProvider";
import "../index.css";

const MeetingLayout = () => {
  const socket = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const roomId = new URLSearchParams(location.search).get("id");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const [myStream, setMyStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  useEffect(() => {
    if (!socket || !roomId) return;

    const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    peerConnectionRef.current = new RTCPeerConnection(configuration);

    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        // Send candidate to the room, we'll simplify and broadcast it to everyone
        // Ideally it's sent to specific socketId
        socket.emit("ice-candidate", { to: roomId, candidate: event.candidate });
      }
    };

    const startLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMyStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => {
          peerConnectionRef.current.addTrack(track, stream);
        });

        socket.emit("join-room", roomId);
      } catch (error) {
        console.error("Camera error:", error);
      }
    };

    startLocalStream();

    const handleUserJoined = async ({ socketId }) => {
      console.log("User joined, creating offer");
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit("offer", { to: socketId, offer });
    };

    const handleOffer = async ({ from, offer }) => {
      console.log("Received offer from", from);
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit("answer", { to: from, answer });
    };

    const handleAnswer = async ({ from, answer }) => {
      console.log("Received answer from", from);
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleIceCandidate = async ({ from, candidate }) => {
      try {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("Error adding ice candidate", e);
      }
    };

    socket.on("user-joined", handleUserJoined);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
      
      if (myStream) {
        myStream.getTracks().forEach((track) => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [socket, roomId]);

  const toggleVideo = () => {
    if (myStream) {
      const videoTrack = myStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const leaveRoom = () => {
    navigate("/");
  };

  return (
    <div className="meet">
      <h2>Room: {roomId}</h2>
      <div className="meet-stage" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h3>You</h3>
          <video ref={localVideoRef} autoPlay playsInline muted width="400" height="300" style={{ backgroundColor: 'black' }} />
        </div>
        <div>
          <h3>Remote</h3>
          <video ref={remoteVideoRef} autoPlay playsInline width="400" height="300" style={{ backgroundColor: 'black' }} />
        </div>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={toggleVideo} style={{ marginRight: '10px' }}>
          {isVideoEnabled ? "Disable Video" : "Enable Video"}
        </button>
        <button onClick={leaveRoom}>Leave Room</button>
      </div>
    </div>
  );
};

export default MeetingLayout;