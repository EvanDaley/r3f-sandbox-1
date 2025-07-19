// Client.js
import React, { useState } from 'react';
import { usePeerStore } from '../store/peerStore';

export default function Client() {
    const [hostId, setHostId] = useState('');
    const [msg, setMsg] = useState('');
    const connectToHost = usePeerStore(state => state.connectToHost);
    const sendMessageTo = usePeerStore(state => state.sendMessageTo);
    const peerId = usePeerStore(state => state.getShortPeerId());
    const messages = usePeerStore(state => state.messages);

    return (
        <div>
            <h2>Client</h2>
            <p>Your ID: {peerId || '...'}</p>
            <input
                type="text"
                value={hostId}
                placeholder="Host ID"
                onChange={e => setHostId(e.target.value)}
            />
            <button onClick={() => connectToHost(hostId)}>Connect</button>

            <input
                type="text"
                value={msg}
                placeholder="Message"
                onChange={e => setMsg(e.target.value)}
            />
            <button onClick={() => sendMessageTo(hostId, msg)}>Send</button>

            <h4>Messages:</h4>
            <ul>
                {messages.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
        </div>
    );
}