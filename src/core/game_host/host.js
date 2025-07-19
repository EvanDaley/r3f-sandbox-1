import Peer from 'peerjs';

export default class Host {
    constructor({ onConnection, onMessage, onStatus, debug = false } = {}) {
        this.debug = debug;
        this.onConnection = onConnection;
        this.onMessage = onMessage;
        this.onStatus = onStatus;

        this.peer = null;
        this.connections = new Map(); // Map of peerId -> DataConnection

        this._init();
    }

    _log(...args) {
        if (this.debug) console.log('[Host]', ...args);
    }

    _init() {
        this.peer = new Peer(undefined, { debug: 2 });

        this.peer.on('open', id => {
            this._log('Host started with ID:', id);
            this.onStatus?.({ type: 'ready', peerId: id });
        });

        this.peer.on('connection', conn => {
            this._log('New connection from', conn.peer);
            this.connections.set(conn.peer, conn);

            conn.on('data', data => {
                this._log('Received from', conn.peer, ':', data);
                this.onMessage?.(conn.peer, data);
            });

            conn.on('close', () => {
                this._log('Connection closed:', conn.peer);
                this.connections.delete(conn.peer);
                this.onStatus?.({ type: 'disconnected', peerId: conn.peer });
            });

            this.onConnection?.(conn.peer);
        });

        this.peer.on('error', err => {
            this._log('Error:', err);
            this.onStatus?.({ type: 'error', error: err });
        });
    }

    send(peerId, message) {
        const conn = this.connections.get(peerId);
        if (conn && conn.open) {
            conn.send(message);
            this._log('Sent to', peerId, ':', message);
        } else {
            this._log('No open connection to', peerId);
        }
    }

    broadcast(message) {
        for (const [peerId, conn] of this.connections.entries()) {
            if (conn.open) {
                conn.send(message);
                this._log('Broadcast to', peerId, ':', message);
            }
        }
    }

    disconnect(peerId) {
        const conn = this.connections.get(peerId);
        if (conn) {
            conn.close();
            this.connections.delete(peerId);
            this._log('Disconnected from', peerId);
        }
    }

    destroy() {
        for (const conn of this.connections.values()) {
            conn.close();
        }
        this.connections.clear();
        this.peer?.destroy();
        this._log('Host destroyed');
    }

    get id() {
        return this.peer?.id ?? null;
    }

    get connectedPeers() {
        return Array.from(this.connections.keys());
    }
}
