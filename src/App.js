import io from "socket.io-client";
import { useEffect, useState } from "react";
import './App.css';


const username = prompt("what is your username");

const socket = io("https://harvey67.github.io/ws/", {
  transports: ["websocket", "polling"]
});

function App() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("username", username);
    });

    socket.on("users", users => {
      setUsers(users);
    });

    socket.on("message", message => {
      setMessages(messages => [...messages, message]);
    });

    socket.on("connected", user => {
      setUsers(users => [...users, user]);
    });

    socket.on("disconnected", id => {
      setUsers(users => {
        return users.filter(user => user.id !== id);
      });
    });
  }, []);

  const submit = event => {
    event.preventDefault();
    socket.emit("send", message);
    setMessage("");
  };

  return (
    <div className="App">
      <div className="row">
        <div className="col-md-12 mt-4 mb-4">
          <h6>Hello {username}</h6>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <h6>Messages</h6>
          <div id="messages">
            {messages.map(({ user, date, text }, index) => (
              <div key={index} className="row mb-2">
                <div className="col-md-3">
                  {date}
                </div>
                <div className="col-md-2">{user.name}</div>
                <div className="col-md-2">{text}</div>
              </div>
            ))}
          </div>
          <form onSubmit={submit} id="form">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                onChange={e => setMessage(e.currentTarget.value)}
                value={message}
                id="text"
              />
              <span className="input-group-btn">
                <button id="submit" type="submit" className="btn btn-primary">
                  Send
                </button>
              </span>
            </div>
          </form>
        </div>
        <div className="col-md-4">
          <h6>Users</h6>
          <ul id="users">
            {users.map(({ name, id }) => (
              <li key={id}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
