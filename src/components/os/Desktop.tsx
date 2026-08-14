"use client";

import { useOSStore } from "@/lib/store";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { WindowManager } from "./WindowManager";
import { LoginScreen } from "./LoginScreen";
import { motion, AnimatePresence } from "framer-motion";

export function Desktop() {
  const { isLoggedIn } = useOSStore();

  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1786415886005-bc08f359b7b8?auto=format&fit=crop&w=2560&q=80")'
      }}
    >
      <AnimatePresence>
        {!isLoggedIn ? (
          <motion.div
            key="login"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[99999]"
          >
            <LoginScreen />
          </motion.div>
        ) : (
          <motion.div
            key="desktop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <MenuBar />
            <WindowManager />
            <Dock />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
