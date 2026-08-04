import { useEffect, useRef } from "react";

interface LiveAudioVisualizerProps {
  mediaRecorder: MediaRecorder;
  height?: number;
}

export default function LiveAudioVisualizer({
  mediaRecorder,
  height = 48,
}: LiveAudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!mediaRecorder || !canvasRef.current) return;

    let animationFrameId: number;
    let audioContext: AudioContext;
    let resizeListener: () => void;

    try {
      // Initialize AudioContext and AnalyserNode
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      audioContext = new AudioContextClass();

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      const source = audioContext.createMediaStreamSource(mediaRecorder.stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Smooth volume tracker
      let smoothVolume = 0;
      let phase = 0;

      // Handle high-DPI scaling to prevent blurriness
      const resizeCanvas = () => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      };

      resizeCanvas();
      resizeListener = () => {
        resizeCanvas();
      };
      window.addEventListener("resize", resizeListener);

      const draw = () => {
        if (!ctx || !canvas) return;
        analyser.getByteFrequencyData(dataArray);

        // Calculate average volume in speech range
        let sum = 0;
        const activeBins = Math.floor(bufferLength * 0.6);
        for (let i = 0; i < activeBins; i++) {
          sum += dataArray[i];
        }
        const average = activeBins > 0 ? sum / activeBins : 0;
        // Boost volume sensitivity to 2.2 to make it react strongly to normal speech
        const normalizedVolume = Math.min(1.0, (average / 255) * 2);

        // Smooth volume changes (faster tracking for snappy response)
        smoothVolume = smoothVolume * 0.8 + normalizedVolume * 0.2;

        const w = canvas.width;
        const h = canvas.height;
        const centerY = h / 2;

        // Clear canvas
        ctx.clearRect(0, 0, w, h);

        // Increment phase based on volume
        phase += 0.08 + smoothVolume * 0.15;

        // Wave configurations
        const baseAmp = h * 0.08; // slightly taller silent breathing
        const maxAmp = h * 0.72; // Maximum amplitude at full volume (from 0.42 to 0.72)
        const amp = baseAmp + smoothVolume * maxAmp;

        const dpr = window.devicePixelRatio || 1;
        const freq = 0.026 / dpr; // Scale frequency with pixel ratio

        const step = Math.max(2, Math.round(dpr)); // Skip pixels to optimize trigonometric calculations

        // 1. Draw the glowing purple-cyan main oscilloscope wave
        ctx.beginPath();
        ctx.shadowBlur = 14 * dpr;
        ctx.shadowColor = "rgba(139, 92, 246, 0.75)"; // Violet/neon purple glow

        // Create horizontal linear gradient from purple to cyan
        const gradient = ctx.createLinearGradient(0, 0, w, 0);
        gradient.addColorStop(0.15, "#a855f7"); // Purple-500
        gradient.addColorStop(0.5, "#6366f1"); // Indigo-500
        gradient.addColorStop(0.85, "#06b6d4"); // Cyan-500

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3 * dpr;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let x = 0; x < w; x += step) {
          const distFromCenter = Math.abs(x - w / 2);
          const maxDist = w / 2;
          // Cosine window / Bell curve (power of 2 to allow wider/longer wave spread)
          const bell = Math.pow(
            Math.cos((distFromCenter / maxDist) * (Math.PI / 2)),
            2,
          );

          // Sine wave formula
          const angle = x * freq - phase;
          const y = centerY + Math.sin(angle) * amp * bell;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.lineTo(w, centerY); // Snap exactly to the right edge
        ctx.stroke();

        // 2. Draw a faint background wave to give a holographic feel
        ctx.beginPath();
        ctx.shadowBlur = 0; // Disable shadow for secondary wave performance
        ctx.strokeStyle = "rgba(99, 102, 241, 0.25)"; // Indigo-500 with 0.25 opacity
        ctx.lineWidth = 1 * dpr;

        for (let x = 0; x < w; x += step) {
          const distFromCenter = Math.abs(x - w / 2);
          const maxDist = w / 2;
          const bell = Math.pow(
            Math.cos((distFromCenter / maxDist) * (Math.PI / 2)),
            2,
          );

          // Slightly different frequency and phase direction
          const angle = x * (freq * 1.25) + phase * 0.8 + Math.PI / 4;
          const y = centerY + Math.sin(angle) * (amp * 0.5) * bell;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.lineTo(w, centerY); // Snap exactly to the right edge
        ctx.stroke();

        animationFrameId = requestAnimationFrame(draw);
      };

      draw();
    } catch (err) {
      console.warn("Could not initialize custom audio visualizer:", err);
    }

    return () => {
      if (resizeListener) {
        window.removeEventListener("resize", resizeListener);
      }
      cancelAnimationFrame(animationFrameId);
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close().catch((err) => {
          console.error("Error closing AudioContext:", err);
        });
      }
    };
  }, [mediaRecorder]);

  return (
    <div
      style={{ height: `${height}px` }}
      className="w-full relative flex items-center justify-center rounded-xl bg-gray-500/5"
    >
      <canvas ref={canvasRef} className="w-full h-full " />
    </div>
  );
}
