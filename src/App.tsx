import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storyNodes, type StoryNodeId } from './data/storyNodes';
import { Flame } from 'lucide-react';

function App() {
  const [currentNodeId, setCurrentNodeId] = useState<StoryNodeId>(1);
  const [history, setHistory] = useState<StoryNodeId[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_prevImage, setPrevImage] = useState<string>('');

  const currentNode = storyNodes[currentNodeId];

  const handleChoice = (nextNodeId: StoryNodeId) => {
    if (nextNodeId === 'start') {
      setCurrentNodeId(1);
      setHistory([]);
      return;
    }
    setHistory([...history, currentNodeId]);
    if (currentNode?.bgImage) {
      setPrevImage(currentNode.bgImage);
    }
    setCurrentNodeId(nextNodeId);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-sans selection:bg-red-500/30">
      {/* Fullscreen Background Image Layer */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentNode?.bgImage}
          initial={{ opacity: 0, scale: 1.1 }}
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
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 md:via-black/20"></div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-end md:justify-center p-6 md:p-12 pb-12">

        {/* Title - Smaller & Elegant */}
        <motion.div
          className="absolute top-6 left-0 w-full text-center md:text-left md:top-12 md:left-12 pointer-events-none"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.8, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-cool text-red-500 text-shadow tracking-widest flex items-center justify-center md:justify-start gap-3 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">
            <Flame className="w-6 h-6 text-orange-600 animate-pulse" />
            <span>血肉終章，鐵火新生</span>
          </h1>
        </motion.div>

        {/* Story Card */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentNodeId}
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-lg md:max-w-2xl"
          >
            <div className="mb-6 md:mb-10">
              <p className="text-lg md:text-2xl leading-relaxed text-gray-100 font-serif drop-shadow-md border-l-4 border-red-700 pl-6 py-2 bg-gradient-to-r from-black/40 to-transparent rounded-r-xl">
                {currentNode ? currentNode.text : "Error: Node not found"}
              </p>
            </div>

            <div className="space-y-3 md:space-y-4 flex flex-col items-stretch">
              {currentNode && currentNode.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.nextNodeId)}
                  className="group relative w-full overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-900/40 to-slate-900/40 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-black/60 backdrop-blur-sm hover:bg-black/40 transition-colors duration-300 px-6 py-4 rounded-lg flex items-center justify-between border border-white/10 group-hover:border-red-500/30">
                    <span className="text-base md:text-lg font-medium text-gray-300 group-hover:text-white transition-colors">
                      {choice.text}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 text-red-400">
                      →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
