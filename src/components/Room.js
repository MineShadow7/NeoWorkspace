import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Room = ({ userID }) => {
  const [users, setUsers] = useState([]);
const  [ roomID, setRoomID ] = useState(null);
const [isConnected, setIsConnected] = useState(false);
    const [roomCode, setRoomCode] = useState(""); // new state for room code

  useEffect(() => {
    const socket = io('http://localhost:5000', {
      withCredentials: true
    });

    // Подключаемся к серверу
    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    // Получаем сообщения от сервера
    socket.on('message', (message) => {
      console.log(message);
    });

    // Получаем пользователей
    socket.on('users', (users) => {
      setUsers(users);
    });

    // При отключении от сервера
    socket.on('disconnect', (message) => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    return () => {
      socket.close();
    };
  }, [userID]);

    useEffect(() => {
        if (roomCode) {
            handleConnectToRoom();
        }
    }, [roomCode]);

    const createRoom = async (event) => {
        if (event) event.preventDefault();
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify({
                userID: 'yourUserID',
                projectName: 'yourProjectName',
            }),
        });

        const data = await response.json();
        setRoomID(data.roomCode);
        setRoomCode(data.roomCode); // set the room code to the newly created room

    };

    const handleRoomCodeChange = (event) => {
        setRoomCode(event.target.value);
    }

    const handleConnectToRoom = async (event) => {
        const token = localStorage.getItem('token');
        console.log("Token is ", token)
        console.log("Room code is ", roomCode)
        if (event) event.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/rooms/${roomCode}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Room not found');
            }
            const room = await response.json();
            setRoomID(room.roomID);
            console.log('Connected to room with code: ', roomCode);

            // Получаем пользователей комнаты
            const usersResponse = await fetch(`http://localhost:5000/api/rooms/${roomCode}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });
            if (!usersResponse.ok) {
                throw new Error('Failed to fetch users');
            }
            const users = await usersResponse.json();
            setUsers(users);
        } catch (error) {
            console.error('Failed to connect to room: ', error);
        }
    }

  return (
      <div>
        <h1>Welcome to the Room System Test Page</h1>
        <h2>Room: {roomID}</h2>
        <input type="text" value={roomID || ''} disabled />
        <button onClick={createRoom} disabled={!isConnected}>Create Room</button>
        <h2>Teachers:</h2>
        <ul>
          {users.filter(user => user.permissions === 1).map(user => (
              <li key={user.id}>{user.name}</li>
          ))}
        </ul>
        <h2>Students:</h2>
        <ul>
          {users.filter(user => user.permissions === 0).map(user => (
              <li key={user.id}>{user.name}</li>
          ))}
        </ul>
          <label htmlFor="roomCode">Room Code:</label>
          <input
              type="text"
              id="roomCode"
              name="roomCode"
              value={roomCode}
              onChange={handleRoomCodeChange}
          />
          <button type="button" onClick={handleConnectToRoom}>
              Connect to Room
          </button>
      </div>
  );
};

export default Room;