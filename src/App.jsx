// src/App.jsx
import React, { useEffect } from 'react';
import { auth, db } from './firebase/config';

function App() {
  useEffect(() => {
    console.log("🔥 Firebase Auth Instance:", auth);
    console.log("📦 Firestore DB Instance:", db);
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🚀 Firebase + Vite + React</h1>
      <p>If you're seeing this, your Firebase is set up correctly 🎉</p>
      <p>Open the console to verify the connection.</p>
    </div>
  );
}

export default App;
