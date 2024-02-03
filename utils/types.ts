import Peer from "peerjs"

export type Nullable<T> = T | null

export type StreamContextType = {
  stream: Nullable<MediaStream>
  setStream: (stream: Nullable<MediaStream>) => void
  peerId: Nullable<string>
  setPeerId: (peerId: Nullable<string>) => void
  peer: Nullable<Peer>
}