import { Users, Presentation, CalendarCheck, GraduationCap, BarChart2, Zap } from 'lucide-react';
import { GlowingEffect } from './ui/glowing-effect'; // Assuming relative path
import { cn } from '../lib/utils';
import React from 'react';

// 1. Define the content for the use cases
const useCases = [
  {
    area: "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]",
    icon: <Zap className="h-5 w-5 text-cyan-400" />,
    title: "Instant Live Polling",
    description: "WebSockets deliver votes instantly. Your audience casts a vote, and the results update on screen immediately.",
  },
  {
    area: "md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]",
    icon: <Presentation className="h-5 w-5 text-indigo-400" />,
    title: "Events & Keynotes",
    description: "Effortlessly engage large crowds. Use a poll code or QR code for seamless participation during live talks and sessions.",
  },
  {
    area: "md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]",
    icon: <GraduationCap className="h-5 w-5 text-cyan-400" />,
    title: "Classroom Feedback",
    description: "Run quick comprehension checks, anonymous quizzes, or group decisions. Perfect for professors and teachers who need instant feedback.",
  },
  {
    area: "md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]",
    icon: <Users className="h-5 w-5 text-indigo-400" />,
    title: "Business & Team Alignment",
    description: "Facilitate rapid decision-making across distributed teams on project priorities, designs, or sprint planning.",
  },
  {
    area: "md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]",
    icon: <BarChart2 className="h-5 w-5 text-cyan-400" />,
    title: "Private or Public Results",
    description: "Maintain control over your data. Toggle your poll results to be public for transparency or private for confidentiality.",
  },
];

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

// --- Reusable Grid Item with Glowing Effect ---
const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn(`min-h-[14rem] list-none`, area)}>
      {/* Outer container for the glowing effect */}
      <div className="relative h-full rounded-2xl border border-slate-800 p-px md:rounded-3xl md:p-px">
        <GlowingEffect
          spread={40}
          glow={false} // Only glow on hover
          disabled={false} // Enable interactive hover effect
          proximity={64}
          inactiveZone={0.01}
          borderWidth={1}
          // The colors are defined in the GlowingEffect.tsx gradient
        />
        
        {/* Inner Card Content */}
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-[calc(1.5rem-1px)] p-6 md:p-6 bg-slate-900 shadow-[0px_0px_27px_0px_#1e293b50] dark:shadow-[0px_0px_27px_0px_#1e293b50]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            
            {/* Icon Container with Opus-style background */}
            <div className="w-fit rounded-xl p-3 bg-indigo-900/50 border border-indigo-800">
              {icon}
            </div>
            
            <div className="space-y-2">
              <h3 className="pt-0.5 font-bold text-2xl text-white">
                {title}
              </h3>
              <p className="font-sans text-lg text-slate-400">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

// --- Main Section Component ---
export default function UseCasesGlowingSection() {
  return (
    <div className="bg-slate-950 py-24 sm:py-32">
        <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="max-w-4xl mx-auto text-center mb-16">
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    Built for Every Scenario
                </h2>
                <p className="mt-4 text-xl text-slate-400">
                    From quick team huddles to massive live events, Opus Polls scales with your need for instant feedback.
                </p>
            </div>

            {/* Glowing Bento Grid */}
            <ul className="grid grid-cols-1 grid-rows-none gap-6 mx-auto max-w-7xl 
                         md:grid-cols-12 md:grid-rows-3 lg:gap-8 xl:grid-rows-2">
                {useCases.map((item, index) => (
                    <GridItem key={index} {...item} />
                ))}
            </ul>
        </div>
    </div>
  );
}