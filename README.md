# 🧠 Brain-Controlled Games with EEG (OpenBCI)

This repo contains two browser-based brain-controlled games built with OpenBCI EEG signals:

- `game` – Controlled by eye blinking (alpha wave spikes)
- `eye_game` – Controlled by horizontal eye movement (based on two channels: N1P and N2P)

---

## 🎮 Game 1: `game/` — Blink-Based Flappy Bird

- Blinking (or closing your eyes) generates a spike in alpha bandpower.
- This spike causes the bird to flap (jump).
- Gameplay is similar to Flappy Bird: avoid obstacles by blinking at the right time.

### 🔁 Signal Used
- EEG Alpha band from a frontal electrode (e.g., Fp1 / Fp2)
- Detects relaxed (eyes closed) state

---

## 👁️ Game 2: `eye_game/` — Eye Movement Control

- Uses **two EEG channels**: `N1P` and `N2P` (left/right near eyes)
- Movement is determined by comparing the signal difference: `diff = N2P - N1P`
- Move a square left or right by moving your eyes

### 🔁 Signal Used
- Raw signal difference between left and right eye channels
- No ML, no alpha — just real-time directional EEG

---

## 🚀 How to Run

### ✅ 1. Start OpenBCI GUI
- Use **Cyton board** or compatible device
- Set `N1P` and `N2P` as active channels
- Go to **Networking** tab:
  - Stream: `UDP`
  - IP: `127.0.0.1`
  - Port: `12345`
  - Stream type: `Band Power` or `Raw`

---

### ✅ 2. Start the UDP WebSocket server

From the root directory:

```bash
node server.js
```

It will show:
```
✅ UDP server listening on port 12345
```

---

### ✅ 3. Run the game in browser

For each game, do the following:

```bash
cd game        # or cd eye_game
npx live-server
```

Then visit: [http://127.0.0.1:8080](http://127.0.0.1:8080)

---

## 🧪 Tips
- Ensure electrodes are well placed near eyes for `eye_game`
- Use `game/` if you're focusing on alpha signals and blink control
- You can tweak thresholds inside `game.js` and `eye_game.js`

---

## 🧠 Built by Eng. Ibr

🚧 This project is actively under development — features, calibration methods, and signal processing logic are evolving rapidly.

