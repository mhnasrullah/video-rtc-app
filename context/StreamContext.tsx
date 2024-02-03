"use client";

import React, { createContext, ReactNode, useEffect, useState } from "react";
import { Nullable, StreamContextType } from "../utils/types";
import Peer from "peerjs";
import { get } from "http";

export const StreamContext = createContext<Nullable<StreamContextType>>(null);

export const StreamProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [stream, setStream] = useState<Nullable<MediaStream>>(null);
  const [peerId, setPeerId] = useState<Nullable<string>>(null);
  const [peerObj, setPeer] = useState<Nullable<Peer>>(null);

  const getPeer = async () => {
    const peer = new (await import("peerjs")).default();

    peer.on("open", (id) => {
      console.log("your device id: ", id);
      setPeerId(id);
    })
    ;
    setPeer(peer);
  };

  useEffect(() => {
    getPeer();
  }, []);

  return (
    <StreamContext.Provider
      value={{
        setStream,
        stream,
        peerId,
        peer: peerObj,
        setPeerId,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};
