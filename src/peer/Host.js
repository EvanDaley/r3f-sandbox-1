// Host.js
import React from 'react';
import { usePeerStore } from '../store/peerStore';


export default function Host() {
    const peerId = usePeerStore(state => state.getShortPeerId());
    const name = usePeerStore(state => state.name);
    const messages = usePeerStore(state => state.messages);
    const connections = usePeerStore(state => state.connections);
    const broadcast = usePeerStore(state => state.broadcastMessage);

    return (
        <div>
            <h2>Host</h2>
            <p>Your ID: {peerId || '...'}</p>
            <p>Your Name: {name || '...'}</p>

            <h4>Connected Clients:</h4>
            <ul>
                {Object.keys(connections).map(id => (
                    <li key={id}>{id}</li>
                ))}
            </ul>

            <button onClick={() => broadcast('Broadcast from host')}>
                Broadcast Hello
            </button>

            <h4>Messages:</h4>
            <ul>
                {messages.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
        </div>
    );
}