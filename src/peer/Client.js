// Client.js
import React, { useState } from 'react';
import { usePeer } from './PeerContext';

export default function Client() {
    const { peer } = usePeer();
    const [hostId, setHostId] = useState('');
    const [conn, setConn] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const connectToHost = () => {
        if (!peer || !hostId) return;
        const connection = peer.connect(hostId);
        setConn(connection);

        connection.on('open', () => {
            connection.send('Hello from client!');
        });

        connection.on('data', data => {
            setMessages(prev => [...prev, data]);
        });
    };

    const sendMessage = () => {
        if (conn && conn.open) {
            conn.send(input);
            setInput('');
        }
    };

    return (
        <div>
            <h2>Client</h2>
            <input value={hostId} onChange={e => setHostId(e.target.value)} placeholder="Enter Host ID" />
            <button onClick={connectToHost}>Connect</button>
            <div>
                <input value={input} onChange={e => setInput(e.target.value)} />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div>
                Messages:
                <ul>
                    {messages.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
            </div>
        </div>
    );
}
