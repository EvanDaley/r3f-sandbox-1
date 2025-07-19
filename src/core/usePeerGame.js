import { useEffect, useRef, useState } from 'react';
import Host from './game_host/host';
import Client from './game_client/client';

export default function usePeerGame({ role, hostId = null, debug = false }) {
    const [peerId, setPeerId] = useState(null);
    const [connectedPeers, setConnectedPeers] = useState([]);
    const [lastMessage, setLastMessage] = useState(null);
    const instanceRef = useRef(null);

    useEffect(() => {
        if (role === 'host') {
            const host = new Host({
                debug,
                onStatus: s => {
                    if (s.type === 'ready') setPeerId(s.peerId);
                    if (s.type === 'disconnected') setConnectedPeers(prev => prev.filter(p => p !== s.peerId));
                },
                onConnection: peerId => {
                    setConnectedPeers(prev => [...prev, peerId]);
                },
                onMessage: (peerId, msg) => {
                    setLastMessage({ from: peerId, content: msg });
                }
            });
            instanceRef.current = host;
        } else if (role === 'client') {
            const client = new Client({
                debug,
                onStatus: s => {
                    if (s.type === 'ready') setPeerId(s.peerId);
                },
                onConnected: () => {
                    setConnectedPeers([hostId]);
                },
                onMessage: msg => {
                    setLastMessage({ from: 'host', content: msg });
                }
            });
            client.connectTo(hostId);
            instanceRef.current = client;
        }

        return () => {
            instanceRef.current?.destroy();
        };
    }, [role, hostId]);

    return {
        peerId,
        connectedPeers,
        lastMessage,
        send: msg => instanceRef.current?.send?.(msg),
        broadcast: msg => instanceRef.current?.broadcast?.(msg), // Only works if host
    };
}
