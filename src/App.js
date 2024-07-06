import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './App.css';

const socket = io('http://localhost:4000', {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

function App() {
  const [messages, setMessages] = useState([]);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/send', { key, value });
      setKey('');
      setValue('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kafka Messages</h1>
        <form onSubmit={sendMessage} className="message-form">
          <input
            type="text"
            placeholder="Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
            className="input"
          />
          <input
            type="text"
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className="input"
          />
          <button type="submit" className="send-button">Send Message</button>
        </form>
        <ul className="message-list">
          {messages.map((msg, index) => (
            <li key={index} className="message-item">
              <strong>{msg.key}</strong>: {msg.value}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
