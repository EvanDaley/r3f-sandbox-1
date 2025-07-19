// import './App.css';
// import ThreeCanvas from './components/three_components/ThreeCanvas'
// import HTMLContent from './components/html_components/HTMLContent'
//
// function App() {
//   return (
//     <>
//       <HTMLContent/>
//       <ThreeCanvas/>
//     </>
//   );
// }
//
// export default App;

// App.js
import React, { useEffect } from 'react';
import { usePeerStore } from './store/peerStore';
import Host from './peer/Host';
import Client from './peer/Client';

function App() {
    const initPeer = usePeerStore(state => state.initPeer);

    useEffect(() => {
        initPeer();
    }, [initPeer]);

    return (
        <div>
            <h1>PeerJS with Zustand</h1>
            <Host />
            <Client />
        </div>
    );
}

export default App;
