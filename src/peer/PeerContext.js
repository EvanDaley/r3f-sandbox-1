import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';

const PeerContext = createContext();

export const usePeer = () => useContext(PeerContext);

export const PeerProvider = ({ children }) => {
    const [peerId, setPeerId] = useState(null);
    const peerRef = useRef(null);

    useEffect(() => {
        const peer = new Peer();
        peerRef.current = peer;

        peer.on('open', id => {
            setPeerId(id);
            console.log('My peer ID is:', id);
        });

        return () => {
            peer.destroy();
        };
    }, []);

    return (
        <PeerContext.Provider value={{ peer: peerRef.current, peerId }}>
            {children}
        </PeerContext.Provider>
    );
};
