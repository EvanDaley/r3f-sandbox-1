import Peer from 'peerjs';

export default class Client {
    constructor({ onConnected, onMessage, onStatus, debug = false } = {}) {
        this.debug = debug;
        this.onConnected = onConnected;
        this.onMessage = onMessage;
        this.onStatus = onStatus;

        this.peer = null;
        this.conn = null;
        this.lastPeerId = null;

        this._init();
    }

    _log(...args) {
        if (this.debug) console.log('[Client]', ...args);
    }

    _init() {
        this.peer = new Peer(undefined, { debug: 2 });

        this.peer.on('open', id => {
            this._log('Client ID:', id);
            if (this.peer.id === null) {
                this.peer.id = this.lastPeerId;
            } else {
                this.lastPeerId = this.peer.id;
            }
            this.onStatus?.({ type: 'ready', peerId: this.peer.id });
        });

        this.peer.on('connection', c => {
            c.on('open', () => {
                c.send("This client does not accept incoming connections");
                setTimeout(() => c.close(), 500);
            });
        });

        this.peer.on('disconnected', () => {
            this._log('Disconnected. Attempting reconnect...');
            this.peer.id = this.lastPeerId;
            this.peer._lastServerId = this.lastPeerId;
            this.peer.reconnect();
            this.onStatus?.({ type: 'disconnected' });
        });

        this.peer.on('close', () => {
            this._log('Connection closed');
            this.conn = null;
            this.onStatus?.({ type: 'closed' });
        });

        this.peer.on('error', err => {
            this._log('Error:', err);
            this.onStatus?.({ type: 'error', error: err });
        });
    }

    connectTo(hostId) {
        if (this.conn) {
            this.conn.close();
        }

        this._log('Connecting to host:', hostId);
        this.conn = this.peer.connect(hostId, { reliable: true });

        this.conn.on('open', () => {
            this._log('Connected to host:', hostId);
            this.onConnected?.(hostId);
            this.onStatus?.({ type: 'connected', peerId: hostId });
        });

        this.conn.on('data', data => {
            this._log('Received from host:', data);
            this.onMessage?.(data);
        });

        this.conn.on('close', () => {
            this._log('Host connection closed');
            this.conn = null;
            this.onStatus?.({ type: 'host-disconnected' });
        });
    }

    send(message) {
        if (this.conn && this.conn.open) {
            this.conn.send(message);
            this._log('Sent to host:', message);
        } else {
            this._log('Cannot send, no open connection');
        }
    }

    destroy() {
        if (this.conn) this.conn.close();
        if (this.peer) this.peer.destroy();
        this._log('Client destroyed');
    }

    get id() {
        return this.peer?.id ?? null;
    }

    get isConnected() {
        return !!(this.conn && this.conn.open);
    }
}
