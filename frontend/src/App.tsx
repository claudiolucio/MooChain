import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from './wagmi'; // Importe o RainbowKitProvider e config
import { config } from './wagmi';
import Dashboard from './dashboard';

function App() {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={[hardhat, sepolia]}>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Router>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
