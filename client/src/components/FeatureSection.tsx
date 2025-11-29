import { BarChart3, QrCode, Lock } from 'lucide-react';
import { WobbleCard } from './ui/WobbleCard';

// Updated feature descriptions
const features = [
  {
    icon: <BarChart3 className="h-8 w-8 text-indigo-300" />,
    title: "Live WebSocket Results",
    description: "Watch votes appear the instant they're cast. Our WebSocket-powered backend broadcasts updates live, keeping your audience locked in and engaged",
  },
  {
    icon: <QrCode className="h-8 w-8 text-indigo-300" />,
    title: "Instant QR & Code Access",
    description: "Forget complex links. Every poll generates a simple 6-character code and a scannable QR code. Your audience can join in seconds",
  },
  {
    icon: <Lock className="h-8 w-8 text-indigo-300" />,
    title: "You Control the Data",
    description: "Need to share results with everyone? Make your poll public. Want to keep it confidential for a private quiz or meeting? Toggle it to private. You're in complete control",
  },
];

export default function FeatureSection() {
  return (
    <div className="bg-slate-950 py-24">
      <div className="container mx-auto px-4">
        {/* Updated Header Text */}
        <h2 className="text-center text-4xl font-bold text-white mb-4">
          Everything You Need - Nothing You Don't
        </h2>
        <p className="text-center text-lg text-slate-400 mb-16 max-w-2xl mx-auto">
          Opus Polls is built for speed and simplicity. From classroom quizzes to conference keynotes, our features are designed to work seamlessly
        </p>

        {/* Wobble Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
          
          <WobbleCard
            containerClassName="col-span-1 lg:col-span-2 h-full bg-indigo-900 min-h-[400px] lg:min-h-[300px]"
          >
            <div className="max-w-xs">
              {features[0].icon}
              <h2 className="text-left text-balance text-2xl font-semibold tracking-[-0.015em] text-white mt-4">
                {features[0].title}
              </h2>
              <p className="mt-4 text-left text-base/6 text-neutral-200">
                {features[0].description}
              </p>
            </div>
          </WobbleCard>
          
          <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-indigo-700">
            {features[1].icon}
            <h2 className="max-w-80 text-left text-balance text-2xl font-semibold tracking-[-0.015em] text-white mt-4">
              {features[1].title}
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              {features[1].description}
            </p>
          </WobbleCard>
          
          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-indigo-950 min-h-[300px]">
             <div className="max-w-sm">
              {features[2].icon}
              <h2 className="max-w-sm md:max-w-lg text-left text-balance text-2xl font-semibold tracking-[-0.015em] text-white mt-4">
                {features[2].title}
              </h2>
              <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                {features[2].description}
              </p>
            </div>
          </WobbleCard>

        </div>
      </div>
    </div>
  );
}