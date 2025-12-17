import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storyNodes, type StoryNodeId } from './data/storyNodes';
import { Flame } from 'lucide-react';

// Effect Component: Floating Embers
const Embers = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-orange-500/60 rounded-full blur-[1px]"
          style={{
            width: Math.random() * 4 + 2 + "px",
            height: Math.random() * 4 + 2 + "px",
            left: Math.random() * 100 + "%",
          }}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.8, 0],
            x: [0, (Math.random() - 0.5) * 50, 0], // Wiggle
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Effect Component: Drifting Steam/Fog
const Steam = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-[-20%] left-[-20%] w-[150%] h-[60%] bg-gradient-to-t from-gray-500/10 via-gray-400/5 to-transparent blur-3xl rounded-[50%]"
          animate={{
            x: ["-10%", "10%", "-10%"],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

function App() {
  const [currentNodeId, setCurrentNodeId] = useState<StoryNodeId>(1);
  const [history, setHistory] = useState<StoryNodeId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const currentNode = storyNodes[currentNodeId];

  // Preload Images
  useEffect(() => {
    const preloadImages = async () => {
      // Extract unique image URLs
      const imageUrls = Array.from(new Set(Object.values(storyNodes).map(node => node.bgImage).filter(Boolean))) as string[];
      let loadedCount = 0;

      const loadImage = (src: string) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          // Fix for GitHub Pages/Vite base path behavior
          img.src = src;
          img.onload = () => resolve();
          img.onerror = () => {
            console.warn(`Failed to preload: ${src}`);
            resolve();
          };
        });
      };

      // Load all images
      const promises = imageUrls.map(async (src) => {
        await loadImage(src);
        loadedCount++;
        setLoadingProgress(Math.round((loadedCount / imageUrls.length) * 100));
      });

      await Promise.all(promises);

      // Small delay for smooth UX
      setTimeout(() => setIsLoading(false), 800);
    };

    preloadImages();
  }, []);

  // Loading Screen Overlay
  const LoadingOverlay = (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
          <div className="flex flex-col items-center gap-6">
            <Flame className="w-12 h-12 text-red-600 animate-pulse" />
            <h2 className="text-2xl font-serif text-gray-300 tracking-widest">載入故事中...</h2>

            <div className="w-64 h-1 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
              <motion.div
                className="h-full bg-red-600 box-shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ type: "spring", stiffness: 100 }}
              />
            </div>

            <p className="text-sm text-gray-600 font-mono">{loadingProgress}%</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const handleChoice = (nextNodeId: StoryNodeId) => {
    if (nextNodeId === 'start') {
      setCurrentNodeId(1);
      setHistory([]);
      return;
    }
    setHistory([...history, currentNodeId]);
    setCurrentNodeId(nextNodeId);
  };

  // Prevent default touch actions
  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener('touchmove', preventDefault, { passive: false });
    return () => document.removeEventListener('touchmove', preventDefault);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-sans selection:bg-none cursor-default">
      {LoadingOverlay}

      {/* Cinematic noise/grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] z-[5] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Global Lighting Vignette */}
      <div className="absolute inset-0 z-[4] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>

      <Embers />
      <Steam />

      {/* Fullscreen Background Image Layer */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentNodeId}
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          {currentNode?.bgImage && (
            <>
              <img
                src={currentNode.bgImage}
                alt="Background"
                className="w-full h-full object-cover opacity-60 md:opacity-50"
                style={currentNode.bgStyle}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Start Screen Logic */}
      <AnimatePresence mode="wait">
        {!isLoading && !gameStarted && (
          <motion.div
            key="start-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1.0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-8">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.7, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-gray-400 font-serif tracking-[0.5em] text-lg md:text-xl"
              >
                第七組 呈現
              </motion.p>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
              >
                <h1 className="text-center text-5xl md:text-7xl font-cool text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-red-600 tracking-widest drop-shadow-[0_0_25px_rgba(220,38,38,0.6)] animate-pulse">
                  血肉終章
                  <br />
                  <span className="text-4xl md:text-6xl text-gray-200 block mt-4">鐵火新生</span>
                </h1>
              </motion.div>

              <motion.button
                onClick={() => setGameStarted(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-12 px-12 py-4 rounded-full border border-red-500/30 bg-red-900/20 hover:bg-red-600/20 text-red-100 font-serif text-xl tracking-[0.2em] transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] group relative overflow-hidden cursor-pointer"
              >
                <span className="relative z-10">開始遊戲</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Credits */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.5, duration: 2 }}
        className="fixed bottom-4 left-0 w-full text-center text-[10px] text-gray-500 tracking-[0.3em] font-mono uppercase z-50 pointer-events-none mix-blend-screen"
      >
        design by kapiso & ORPHAN
      </motion.p>

      {/* Main Game Content (Only visible if gameStarted) */}
      <AnimatePresence>
        {gameStarted && (
          <motion.div className="contents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>

            {/* Content Container */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-end md:justify-center p-6 md:p-12 pb-24 md:pb-32">

              {/* Title (Hidden on Defeat) */}
              {!currentNode?.isDefeat && (
                <motion.div
                  className="absolute top-6 left-0 w-full text-center md:text-left md:top-12 md:left-12 pointer-events-none"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 0.8, y: 0 }}
                >
                  <h1 className="text-3xl md:text-4xl font-cool text-red-500 tracking-widest flex items-center justify-center md:justify-start gap-3 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                    <Flame className="w-6 h-6 text-orange-600 animate-[pulse_3s_ease-in-out_infinite]" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400 font-black">血肉終章，鐵火新生</span>
                  </h1>
                </motion.div>
              )}

              {/* Story Card */}
              <AnimatePresence mode='wait'>
                {currentNode?.isDefeat ? (
                  // --- DEFEAT SCREEN (Full Layer) ---
                  <motion.div
                    key="defeat-screen"
                    initial={{ opacity: 0, backgroundColor: "rgba(0,0,0,0)" }}
                    animate={{ opacity: 1, backgroundColor: "#000000" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.0, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.0, delay: 1.0, ease: "easeOut" }}
                      className="relative z-10 text-center mx-4 flex flex-col items-center gap-8"
                    >
                      <h2 className="text-6xl md:text-9xl font-black text-red-600 tracking-[0.5rem] md:tracking-[1rem] uppercase font-cool drop-shadow-[0_0_50px_rgba(220,38,38,1)]"
                        style={{ textShadow: "0 0 30px rgba(255,0,0,0.6)" }}>
                        DEFEAT
                      </h2>

                      <p className="text-base md:text-lg text-gray-400 font-serif drop-shadow-lg max-w-lg mx-auto leading-relaxed">
                        {currentNode.text}
                      </p>

                      <div className="flex flex-col items-center gap-4 w-full max-w-xs transition-opacity duration-1000 delay-1000" style={{ opacity: 1 }}>
                        {currentNode.choices.map((choice, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleChoice(choice.nextNodeId)}
                            className="group relative w-full overflow-hidden rounded-xl p-[2px] focus:outline-none transition-transform duration-300 active:scale-[0.95]"
                          >
                            {/* Smoother Rotating Border: Conic Gradient + Oversized Div */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_60deg,#dc2626_120deg,transparent_180deg,transparent_240deg,#dc2626_300deg,transparent_360deg)] animate-[spin_4s_linear_infinite] opacity-80 group-hover:opacity-100"></div>

                            {/* Inner Content Mask */}
                            <div className="relative bg-black h-full w-full rounded-[10px] px-10 py-6 flex items-center justify-center transition-all duration-500 group-hover:bg-red-950/20 backdrop-blur-xl">
                              <span className="text-xl md:text-2xl text-red-100 font-bold tracking-[0.2em] font-serif group-hover:text-white drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all duration-300">
                                {choice.text}
                              </span>
                            </div>

                            {/* Soft Pulse Glow Behind (Smoother) */}
                            <div className="absolute inset-0 rounded-xl bg-red-600/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out -z-10"></div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  // --- NORMAL STORY CARD ---
                  <motion.div
                    key={currentNodeId}
                    initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
                    transition={{ duration: 1.0, ease: "easeOut" }}
                    className={`w-full max-w-lg md:max-w-2xl backdrop-blur-md bg-black/40 p-8 md:p-10 rounded-2xl border border-white/5 shadow-2xl`}
                  >
                    <div className="mb-6 md:mb-10 relative">
                      {/* Decorative Line (Index) - Now inside the visual container */}
                      {!currentNode?.isDefeat && (
                        <div className="absolute left-0 top-1 bottom-1 w-1 bg-gradient-to-b from-transparent via-red-500 to-transparent opacity-90 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                      )}

                      {/* Text hidden if defeat (merged above) */}
                      {!currentNode?.isDefeat && (
                        <p className="pl-6 md:pl-8 text-lg md:text-2xl text-gray-100 leading-relaxed font-serif drop-shadow-lg text-shadow transition-all duration-500">
                          {currentNode ? currentNode.text : "Error: Node not found"}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 md:space-y-4 flex flex-col items-stretch">
                      {/* Buttons hidden if defeat (merged above) */}
                      {!currentNode?.isDefeat && currentNode && currentNode.choices.map((choice, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleChoice(choice.nextNodeId)}
                          className="group relative w-full overflow-hidden rounded-lg p-[1px] focus:outline-none transition-transform duration-200 active:scale-[0.98]"
                        >
                          {/* Animated border/bg effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-red-900/0 via-red-500/20 to-red-900/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                          <div className="relative transition-colors duration-300 px-6 py-4 rounded-lg flex items-center justify-between border border-white/20 shadow-lg bg-gray-900/80 hover:bg-black/60 group-hover:border-red-500/50 justify-between backdrop-blur-sm">
                            <span className="text-base md:text-lg text-gray-200 group-hover:text-white text-left font-medium transition-colors tracking-wide font-sans drop-shadow-md">
                              {choice.text}
                            </span>
                            <span className="opacity-40 group-hover:opacity-100 transform translate-x-[-5px] group-hover:translate-x-0 transition-all duration-300 text-red-500 text-xl">
                              ⬩
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
