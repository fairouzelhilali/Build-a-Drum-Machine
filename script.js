const { useState, useEffect } = React;

const sounds = [
  { key: "Q", id: "Heater 1", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3" },
  { key: "W", id: "Heater 2", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3" },
  { key: "E", id: "Heater 3", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3" },
  { key: "A", id: "Heater 4", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3" },
  { key: "S", id: "Clap", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3" },
  { key: "D", id: "Open HH", url: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3" },
  { key: "Z", id: "Kick Hat", url: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3" },
  { key: "X", id: "Kick", url: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3" },
  { key: "C", id: "Closed HH", url: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3" }
];

function App() {
  const [display, setDisplay] = useState("Ready 🎧");
  const [active, setActive] = useState("");
  const [volume, setVolume] = useState(0.5);
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState([]);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const play = (key, id, save = true) => {
    const audio = document.getElementById(key);
    if (!audio) return;

    audio.volume = volume;
    audio.currentTime = 0;
    audio.play();

    setDisplay(id);
    setActive(key);
    setTimeout(() => setActive(""), 120);

    if (recording && save) {
      setRecorded(prev => [...prev, key]);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      const sound = sounds.find(s => s.key === e.key.toUpperCase());
      if (sound) play(sound.key, sound.id);
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [volume, recording]);

  const playRecording = async () => {
    for (let k of recorded) {
      const sound = sounds.find(s => s.key === k);
      if (sound) {
        play(sound.key, sound.id, false);
        await new Promise(r => setTimeout(r, 300));
      }
    }
  };

  return (
    <div id="drum-machine">
      <div id="display">{display}</div>

      {/* Controls */}
      <div className="controls">
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          Toggle Theme
        </button>

        <button onClick={() => setRecording(!recording)}>
          {recording ? "Stop Recording" : "Record"}
        </button>

        <button onClick={playRecording}>
          Play Recording
        </button>

        <br />

        🔊
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        />
      </div>

      {/* Pads */}
      <div className="pad-container">
        {sounds.map(s => (
          <button
            key={s.key}
            id={s.id}
            className={`drum-pad ${active === s.key ? "active" : ""}`}
            onClick={() => play(s.key, s.id)}
          >
            {s.key}
            <audio className="clip" id={s.key} src={s.url}></audio>
          </button>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
