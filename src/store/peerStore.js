// peerStore.js
import create from 'zustand';
import Peer from 'peerjs';
import {generateSimpleId, generateSimpleRandomChars, pickRandomName} from "../utilities/stringHelpers";

export const usePeerStore = create((set, get) => ({
    peer: null,
    peerId: null,
    connections: {}, // <--- new
    messages: [],
    names: {},
    name: '',

    // Everybody's id starts with the same 32 characters.
    // We will append 4 additional characters which will still give us 1+ million combos.
    // This makes it simple for users to search for each other.
    connectionPrefix: 'f773d09c-0c44-4ffd-887d-a4cb8161',

    initPeer: () => {
        // prevent multiple init
        if (get().peer) return;

        console.log('initPeer called')

        const name = pickRandomName()
        set({ name });

        // Build a room id
        const roomId = generateSimpleId()
        const preferredId = get().connectionPrefix + roomId

        const peer = new Peer(
            preferredId,
            {
                debug: 2
            }
        );

        set({ peer });

        peer.on('open', id => {
            set({ peerId: id });
            console.log('Peer ID:', id);
        });

        peer.on('connection', connection => {
            const { peer: senderId, metadata } = connection;
            const name = get().name || 'Unknown';

            // Store the connection and name
            set(state => ({
                connections: { ...state.connections, [senderId]: connection },
                names: { ...state.names, [senderId]: name },
            }));

            connection.on('data', data => {
                set(state => ({
                    messages: [...state.messages, `[${name}]: ${data}`],
                }));

                // Relay to others
                const { connections } = get();
                Object.entries(connections).forEach(([peerId, conn]) => {
                    if (peerId !== senderId && conn.open) {
                        conn.send(`[${name}]: ${data}`);
                    }
                });
            });

            connection.on('open', () => {
                connection.send(`Welcome, ${name}!`);
            });

            connection.on('close', () => {
                set(state => {
                    const newConnections = { ...state.connections };
                    const newNames = { ...state.names };
                    delete newConnections[senderId];
                    delete newNames[senderId];
                    return {
                        connections: newConnections,
                        names: newNames
                    };
                });
            });
        });
    },

    getShortPeerId: () => {
        const id = get().peerId;
        return id ? id.slice(32) : '';
    },

    connectToHost: (hostId, name = '') => {
        const peer = get().peer;
        if (!peer) return;

        if (!name) {
            name = pickRandomName()
        }

        const targetId = get().connectionPrefix + hostId;

        const conn = peer.connect(targetId, {
            metadata: { name }
        });

        conn.on('open', () => {
            conn.send(`Hello from ${name}`);
        });

        conn.on('data', data => {
            set(state => ({
                messages: [...state.messages, data],
            }));
        });

        set(state => ({
            connections: { ...state.connections, [hostId]: conn }
        }));
    },

    sendMessageTo: (targetId, msg) => {
        const conn = get().connections[targetId];
        if (conn && conn.open) {
            conn.send(msg);
        }
    },

    broadcastMessage: (msg) => {
        const conns = get().connections;
        Object.values(conns).forEach(conn => {
            if (conn.open) conn.send(msg);
        });
    }
}));
