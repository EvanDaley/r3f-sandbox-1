// Host.js
import React, { useEffect, useState } from 'react';
import { usePeer } from './PeerContext';

export default function Host() {
    const { peer, peerId } = usePeer();
    const [conn, setConn] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!peer) return;

        peer.on('connection', connection => {
            console.log('Client connected:', connection);
            setConn(connection);

            connection.on('data', data => {
                setMessages(prev => [...prev, data]);
            });

            connection.on('open', () => {
                connection.send('Hello from host!');
            });
        });
    }, [peer]);

    return (
        <div>
            <h2>Host</h2>
            <p>Your ID: {peerId}</p>
            <div>
                Messages:
                <ul>
                    {messages.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
            </div>
        </div>
    );
}
