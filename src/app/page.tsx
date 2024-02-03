"use client";

import { useRouter } from "next/navigation";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { StreamContext } from "../../context/StreamContext";
import { Nullable } from "../../utils/types";
import Peer, { MediaConnection } from "peerjs";

const Page: FC = () => {
  const { push } = useRouter();
  const streamContext = useContext(StreamContext)

  const [room, setRoom] = useState<string>("");

  const videoRef = useRef<Nullable<HTMLVideoElement>>(null)

  const getConnectedDevices = async (type: string) => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === type);
  };

  const openCam = async () => {
    return await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
  };

  const handleWebCam = async () => {
    const cameras = await getConnectedDevices("videoinput");

    if (cameras && cameras.length > 0) {
      const stream = await openCam();
      streamContext?.setStream(stream)
    }
  };

  useEffect(() => {
    if (streamContext?.stream && videoRef.current) {
      videoRef.current.srcObject = streamContext.stream;
    }
  }, [streamContext?.stream]);

  useEffect(() => {
    handleWebCam();
  }, []);

  return (
    <div>
      <h1>Join</h1>

      {streamContext?.stream && (
        <video ref={videoRef} autoPlay playsInline width={500} height={500} />
      )}

      <input
        type="text"
        onChange={(e) => setRoom(e.target.value)}
        value={room}
      />
      <button onClick={room ? () => push(room) : () => {}}>Create or join</button>
    </div>
  );
};

export default Page;
