import { useState } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handleLogin = () => {
    console.log('Brukernavn:', username)
    console.log('Passord:', password)
    alert(`Logget inn som ${username}`)
  }

  const handleRegister = () => {
    console.log('Ny bruker:', newUsername)
    console.log('Nytt passord:', newPassword)
    alert(`Bruker ${newUsername} registrert!`)
    setShowRegister(false)
    setNewUsername('')
    setNewPassword('')
  }

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
              onChange={(e) => setNewUsername(e.target.value)}
            />
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



