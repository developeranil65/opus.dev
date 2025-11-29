import { InfiniteMovingCards } from './ui/infinite-moving-cards';
import { cn } from '../lib/utils';
import React from 'react';

// Mock data focused on the app's key benefits (speed, ease, real-time)
const testimonials = [
  {
    quote:
      "The real-time results feature is a game-changer for my presentations. I used to spend minutes refreshing, now the data just appears. Instant engagement, zero fuss.",
    name: "Dr. Evelyn Reed",
    title: "Keynote Speaker & Researcher",
  },
  {
    quote:
      "We needed a simple way to poll our remote development team on sprint priorities. Opus Polls delivered the fastest, most streamlined experience we've found. The QR code sharing is brilliant.",
    name: "Jamie Chen",
    title: "Software Team Lead",
  },
  {
    quote: "Setup took less than 60 seconds. My students love the simple voting interface, and I love the ability to toggle results as private. Highly recommended for education!",
    name: "Michael Brandt",
    title: "High School Educator",
  },
  {
    quote:
      "Voting on group decisions used to be a mess of Slack messages. Now, we just drop the 6-digit code and everyone votes instantly. It has genuinely increased our meeting efficiency.",
    name: "Sarah Williams",
    title: "Project Coordinator",
  },
  {
    quote:
      "The security and role-based access control gave me confidence to use it for internal company voting. It’s professional, fast, and looks fantastic.",
    name: "Alex Johnson",
    title: "VP of Operations",
  },
];

export default function TestimonialsSection() {
  return (
    <div className="bg-slate-950 py-24 sm:py-32">
        <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="max-w-4xl mx-auto text-center mb-16">
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    Trusted by Professionals & Educators
                </h2>
                <p className="mt-4 text-xl text-slate-400">
                    See what others are saying about the power of instant, real-time feedback.
                </p>
            </div>
            
            {/* Infinite Moving Cards Demo */}
            <div className="h-[25rem] md:h-[30rem] flex flex-col items-center justify-center relative overflow-hidden">
                <InfiniteMovingCards
                    items={testimonials}
                    direction="right"
                    speed="normal"
                    pauseOnHover={true}
                    className="max-w-full"
                />
            </div>
        </div>
    </div>
  );
}