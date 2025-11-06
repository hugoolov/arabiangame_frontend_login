import { useState } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')

const handleLogin = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Logged in:', data);
      alert(`Logget inn som ${data.username}`);
      // Store userId in localStorage or state for later use
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username);
    } else {
      const error = await response.text();
      alert(`Login feilet: ${error}`);
    }
  } catch (error) {
    alert('Noe gikk galt ved innlogging');
  }
};

const handleRegister = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newUsername, password: newPassword })
    });

    if (response.ok) {
      const data = await response.json();
      alert(`Bruker ${data.username} registrert!`);
      setShowRegister(false);
      setNewUsername('');
      setNewPassword('');
    } else {
      const error = await response.text();
      alert(`Registrering feilet: ${error}`);
    }
  } catch (error) {
    alert('Noe gikk galt ved registrering');
  }
};

const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

const checkUsername = async (username: string) => {
  if (username.length < 3) {
    setUsernameAvailable(null);
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/api/auth/check-username?username=${username}`);
    const available = await response.json();
    setUsernameAvailable(available);
  } catch (error) {
    console.error('Error checking username:', error);
  }
};

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Brukernavn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Passord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <button onClick={() => setShowRegister(true)}>Registrer deg</button>
      </div>

      {/* Registreringsvindu */}
      {showRegister && (
        <div className="modal">
          <div className="modal-content">
            <h2>Registrer ny bruker</h2>
            <input
              type="text"
              placeholder="Nytt brukernavn"
              value={newUsername}
              onChange={(e) => {
                setNewUsername(e.target.value);
                checkUsername(e.target.value);
              }}
            />
            {usernameAvailable === false && <p style={{color: 'red'}}>Username taken</p>}
            {usernameAvailable === true && <p style={{color: 'green'}}>Username available</p>}
            <input
              type="password"
              placeholder="Nytt passord"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div>
              <button onClick={handleRegister}>Registrer</button>
              <button onClick={() => setShowRegister(false)}>Avbryt</button>
            </div>
          </div>
        </div>
      )}

    </>
  )
}

export default App



