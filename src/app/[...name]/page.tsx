"use client";

import { useContext, useEffect, useRef, useState } from "react";
import supa from "@/lib/supa";
import { useParams, useRouter } from "next/navigation";
import { StreamContext } from "../../../context/StreamContext";
import Peer, { MediaConnection } from "peerjs";
import Video from "../../../components/Video";

export default function Home() {
  const { name } = useParams();
  const { back } = useRouter();

  const streamContext = useContext(StreamContext);
  const [listStream, setListStream] = useState<
    {
      id: string;
      stream: MediaStream;
    }[]
  >([]);
  const [joined, setJoined] = useState(false);
  const [loadingToJoin, setLoadingToJoin] = useState(false);

  console.log(streamContext?.peerId, "self peer id");
  const handleJoin = () => {
    setJoined(true);
    setLoadingToJoin(true);
    const channel = supa.channel(name as string);
    console.log(streamContext?.peerId, "self peer id on join");

    channel.send({
      type: "broadcast",
      event: "join",
      payload: { peerId: streamContext?.peerId },
    });
  };

  console.log("stream device :", streamContext?.stream);

  const handleCall = (peerId: string) => {
    if (!streamContext?.stream) {
      console.error("no stream");
    }

    console.log("calling to", peerId);
    const call = streamContext?.peer?.call(
      peerId,
      streamContext?.stream as MediaStream
    );

    console.log("after call");
    call?.on("stream", (remoteStream) => {
      console.log(remoteStream, `get remote stream from ${peerId}`);
      console.log(listStream, "current list stream");
      setListStream([
        ...listStream,
        {
          id: peerId,
          stream: remoteStream,
        },
      ]);
    });
  };

  useEffect(() => {
    streamContext?.peer?.on("call", (call: MediaConnection) => {
      if (!streamContext?.stream) {
        console.error("no stream");
      } else {
        console.log("answering call");
        call.answer(streamContext?.stream as MediaStream);

        call?.on("stream", (remoteStream) => {
          console.log(call, "call id");
          console.log(remoteStream, `get remote stream from ${call.peer}`);
          console.log(listStream, "current list stream");
          setListStream([
            ...listStream,
            {
              id: call.peer,
              stream: remoteStream,
            },
          ]);
        });
      }

      setLoadingToJoin(false);
    });
  }, []);

  useEffect(() => {
    const channel = supa.channel(name as string);

    channel
      .on(
        "broadcast",
        {
          event: "join",
        },
        (payload) => {
          const newPeerId = payload.payload.peerId;

          if (newPeerId !== streamContext?.peerId) {
            handleCall(newPeerId);
          }
        }
      )
      .subscribe();
  }, []);

  console.log(listStream, "list stream");

  return (
    <main>
      <p>{name}</p>
      {joined ? (
        <div>
          <div>
            {streamContext?.stream ? (
              <Video srcObject={streamContext?.stream} />
            ) : (
              <p>video not available</p>
            )}
            <p>{streamContext?.peerId}</p>
          </div>
          {listStream.map((stream, i) => (
            <div key={i}>
              <Video srcObject={stream.stream} />
              <p>{stream.id}</p>
            </div>
          ))}
        </div>
      ) : (
        <>
          <button onClick={handleJoin}>join</button>
          {loadingToJoin && <p>loading to join</p>}
        </>
      )}
    </main>
  );
}
