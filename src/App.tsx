import React, { useRef } from 'react';
import { PhoneOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { CameraPreview } from './components/video/CameraPreview';
import { CursorEdgeGlowButton } from './components/ui/cursor-edge-glow-button';
import { ConnectingOverlay } from './components/ui/ConnectingOverlay';
import { WreckShader } from './components/WreckShader';
import { useGeminiLive } from './hooks/useGeminiLive';
import { SYSTEM_MESSAGE_SETTINGS } from './lib/SystemMessage';
import { selectedVoice } from './lib/voices';

export default function App() {
  const stageRef = useRef<HTMLDivElement>(null);
  const {
    isConnected,
    isMuted,
    cameraFacing,
    isAudioPlaying,
    micVolume,
    isUserTalking,
    transcript,
    sessionEnded,
    isRecording,
    startRecording,
    stopRecording,
    status,
    videoRef,
    canvasRef,
    startConnection,
    disconnect,
    toggleMute,
    flipCamera,
  } = useGeminiLive(SYSTEM_MESSAGE_SETTINGS);

  const downloadTranscript = () => {
    if (!transcript.length) return;
    const text = transcript
      .map((item) => `[${item.role === 'agent' ? 'ROASTTID' : 'YOU'}]: ${item.text}`)
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roasttid-transcript-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const visualMode: 'idle' | 'listening' | 'speaking' = isAudioPlaying
    ? 'speaking'
    : isUserTalking
      ? 'listening'
      : 'idle';

  const audioLevel = isAudioPlaying
    ? 0.85
    : isUserTalking
      ? 0.12 + (micVolume * 0.4)
      : 0.12;

  return (
    <div className="min-h-[100svh] bg-zinc-950 text-zinc-100 flex flex-col overflow-y-auto selection:bg-brand-primary/30">
      <main className="flex-1 relative flex flex-col lg:flex-row overflow-hidden h-full">
        <div
          ref={stageRef}
          className="flex-1 relative bg-black flex roast-gradient min-h-[100svh]"
        >
          {/* Orb — always behind everything */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <WreckShader audioLevel={audioLevel} visualMode={visualMode} />
          </div>

          <ConnectingOverlay show={status === "connecting"} />

          {/*
            CameraPreview is ALWAYS mounted so videoRef.current is non-null
            when startStreaming runs — this lets play() succeed immediately
            when the camera permission is granted (within the gesture context).
            It's invisible until the call is live.
          */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ opacity: isConnected ? 1 : 0, transition: 'opacity 0.3s' }}
          >
            <CameraPreview
              videoRef={videoRef}
              cameraFacing={cameraFacing}
              stageRef={stageRef}
              onFlip={flipCamera}
            />
          </div>

          {/* Download Transcript Pill (Appears when session ends and transcript exists in localStorage/state) */}
          <AnimatePresence>
            {!isConnected && sessionEnded && transcript.length > 0 && (
              <motion.button
                key="download-transcript-button"
                id="btn-download-transcript"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                type="button"
                onClick={downloadTranscript}
                className={cn(
                  "absolute bottom-[calc(max(1rem,env(safe-area-inset-bottom))+3.5rem)] left-1/2 -translate-x-1/2 z-20 pointer-events-auto",
                  "flex items-center justify-center px-5 h-9 rounded-full font-mono text-xs uppercase tracking-widest",
                  "bg-black/80 backdrop-blur-xl border border-white/80 shadow-[0_0_20px_rgba(0,0,0,0.8),inset_0_0_10px_rgba(255,255,255,0.1)]",
                  "text-white cursor-pointer active:scale-95 hover:border-white transition-all duration-300 touch-manipulation"
                )}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                DOWNLOAD TRANSCRIPT
              </motion.button>
            )}
          </AnimatePresence>

          

          {/* Phone button (pre-call) / Dock (in-call) */}
          <AnimatePresence mode="wait">
            {!isConnected ? (
              <motion.div
                key="disconnected-screen"
                id="btn-start-call"
                role="button"
                aria-label="start_call"
                onClick={() => {
                  if (status !== "connecting") startConnection(selectedVoice);
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-20 pointer-events-auto"
              >
                <CursorEdgeGlowButton />
              </motion.div>
            ) : (
              <motion.button
                key="connected-screen"
                id="btn-end-call"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                type="button"
                onClick={disconnect}
                aria-label="end_call"
                className={cn(
                  "absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-20 pointer-events-auto",
                  "flex items-center justify-center w-60 max-w-[calc(100vw-32px)] h-11 rounded-full",
                  "bg-black/80 backdrop-blur-xl border border-white/80 shadow-[0_0_20px_rgba(0,0,0,0.8),inset_0_0_10px_rgba(255,255,255,0.1)]",
                  "text-red-500 cursor-pointer active:scale-90 hover:border-white transition-all duration-300 touch-manipulation"
                )}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <PhoneOff size={24} className="pointer-events-none" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </main>

      <canvas ref={canvasRef} width={1280} height={720} style={{ display: 'none' }} />
    </div>
  );
}
