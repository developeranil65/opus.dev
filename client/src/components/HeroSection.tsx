import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LampContainer } from "./ui/Lamp.tsx";
import { HoverBorderGradient } from "./ui/HoverBorderGradient.tsx"; 
import HeroPollForm from "./HeroPollForm.tsx"; // We'll use this component

export default function HeroSection() {
  return (
    <LampContainer>

      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
        Engage Your Audience <br /> Instantly
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 120 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.4,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-4 text-lg text-slate-400 max-w-xl text-center"
        >
        Launch real-time polls, share with a simple code or QR, and watch the results update live. No complex setup, no delays. Just instant engagement
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 140 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.5,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-10"
        >
        <HoverBorderGradient
          as={Link}
          containerClassName="rounded-full"
          className="bg-slate-950 text-white px-8 py-4"
          >
          <span className="font-semibold text-lg">Get Started For Free</span>
        </HoverBorderGradient>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 160 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.6,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-4 w-full max-w-xl"
        >
        {/* Divider text */}
        <div className="flex items-center gap-4 mb-4 ">
          <div className="flex-grow h-px bg-slate-700" />
          <span className="text-slate-400">Join an Existing Poll</span>
          <div className="flex-grow h-px bg-slate-700" />
        </div>
        
        <HeroPollForm />
      </motion.div>

    </LampContainer>
  );
}