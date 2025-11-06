import { useState, useEffect } from 'react';
import './App.css';

interface WeatherData {
  temperature: number;
  windSpeed: number;
  symbolCode: string;
  condition: string;
  shouldGoOutside: boolean;
  message: string;
}

const WeatherDisplay: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/weather');
      if (!response.ok) throw new Error('Failed to fetch weather');
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Could not load weather data');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    const icons: Record<string, string> = {
      sunny: '☀️',
      partly_cloudy: '⛅',
      cloudy: '☁️',
      rainy: '🌧️',
      snowy: '❄️',
      thunderstorm: '⛈️',
      foggy: '🌫️',
      unavailable: '❓'
    };
    return icons[condition] || '🌤️';
  };

  if (loading) return <div className="weather-display loading">Loading weather...</div>;
  if (error || !weather) return <div className="weather-display error">Weather unavailable</div>;

  return (
    <div className={`weather-display ${weather.shouldGoOutside ? 'sunny-alert' : ''}`}>
      <div className="weather-content">
        <div className="weather-icon">{getWeatherIcon(weather.condition)}</div>
        <div className="weather-info">
          <div className="temperature">{Math.round(weather.temperature)}°C</div>
          <div className="condition">{weather.condition.replace('_', ' ')}</div>
          <div className="wind">Wind: {Math.round(weather.windSpeed)} m/s</div>
        </div>
      </div>

      {weather.shouldGoOutside ? (
        <div className="weather-alert">
          <h3>🌞 Go Outside! 🌞</h3>
          <p>{weather.message}</p>
        </div>
      ) : (
        <div className="weather-message">
          <p>{weather.message}</p>
        </div>
      )}
    </div>
  );
};

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Logget inn som ${data.username}`);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', data.username);
      } else {
        alert(`Login feilet: ${await response.text()}`);
      }
    } catch {
      alert('Noe gikk galt ved innlogging');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Bruker ${data.username} registrert!`);
        setShowRegister(false);
        setNewUsername('');
        setNewPassword('');
      } else {
        alert(`Registrering feilet: ${await response.text()}`);
      }
    } catch {
      alert('Noe gikk galt ved registrering');
    }
  };

  const checkUsername = async (username: string) => {
    if (username.length < 3) return setUsernameAvailable(null);
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

      <WeatherDisplay />

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
            {usernameAvailable === false && <p style={{ color: 'red' }}>Username taken</p>}
            {usernameAvailable === true && <p style={{ color: 'green' }}>Username available</p>}
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
  );
}

export default App;



