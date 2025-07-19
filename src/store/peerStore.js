// peerStore.js
import create from 'zustand';
import Peer from 'peerjs';

export const usePeerStore = create((set, get) => ({
    peer: null,
    peerId: null,
    connections: {}, // <--- new
    messages: [],

    initPeer: () => {
        const peer = new Peer();

        set({ peer });

        peer.on('open', id => {
            set({ peerId: id });
            console.log('Peer ID:', id);
        });

        peer.on('connection', connection => {
            const { peer: senderId } = connection;

            set(state => ({
                connections: { ...state.connections, [senderId]: connection },
            }));

            connection.on('data', data => {
                // Log the message
                set(state => ({
                    messages: [...state.messages, `[${senderId}]: ${data}`],
                }));

                // Forward to all other clients
                const { connections } = get();
                Object.entries(connections).forEach(([peerId, conn]) => {
                    if (peerId !== senderId && conn.open) {
                        conn.send(`[${senderId}]: ${data}`);
                    }
                });
            });

            connection.on('open', () => {
                connection.send(`Welcome, ${senderId}!`);
            });

            connection.on('close', () => {
                set(state => {
                    const newConnections = { ...state.connections };
                    delete newConnections[senderId];
                    return { connections: newConnections };
                });
            });
        });
    },

    connectToHost: (hostId) => {
        const peer = get().peer;
        if (!peer) return;

        const conn = peer.connect(hostId);

        conn.on('open', () => {
            conn.send(`Hello from client ${peer.id}`);
        });

        conn.on('data', data => {
            set(state => ({
                messages: [...state.messages, data],
            }));
        });

        // Clients can still store the connection if you want
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
