import { Link } from 'react-router-dom';
import { Copy, Trash2, BarChart2, CheckCircle, XCircle, QrCode, X } from 'lucide-react';
import { useState } from 'react';
import { Meteors } from './ui/Meteors'; // <-- 1. IMPORT METEORS

// Update the Poll interface to include qrUrl
export interface Poll {
  _id: string;
  title: string;
  pollCode: string;
  createdAt: string;
  expiresAt: string | null;
  isPublicResult: boolean;
  qrUrl: string;
}

interface PollCardProps {
  poll: Poll;
  onDelete: (pollCode: string) => void;
}

export default function PollCard({ poll, onDelete }: PollCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const isExpired = poll.expiresAt && new Date(poll.expiresAt) < new Date();
  const voteUrl = `${window.location.origin}/vote/${poll.pollCode}`;

  return (
    <>
      {/* 2. ADD 'relative' AND 'overflow-hidden' TO THE MAIN CARD */}
      <div className="relative overflow-hidden bg-slate-900 rounded-2xl shadow-lg border border-slate-700 p-6 flex flex-col justify-between">
        
        {/* 3. ADD 'relative z-10' TO WRAPPER TO PUT CONTENT ABOVE METEORS */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-white mr-4">{poll.title}</h2>
            <span
              className={`flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                poll.isPublicResult
                  ? 'bg-green-900 text-green-300'
                  : 'bg-red-900 text-red-300'
              }`}
            >
              {poll.isPublicResult ? 'Public' : 'Private'}
            </span>
          </div>

          {/* Poll Code */}
          <div className="mb-4">
            <p className="text-sm text-slate-400 mb-2">Poll Code</p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg text-cyan-400 bg-slate-800 px-3 py-1 rounded">
                {poll.pollCode}
              </span>
              <button
                onClick={() => handleCopy(poll.pollCode)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md"
                title="Copy code"
              >
                {isCopied ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Status & Date */}
          <div className="space-y-2 mb-6">
            <p className="text-sm text-slate-400">
              Created: {new Date(poll.createdAt).toLocaleDateString()}
            </p>
            <div className="flex items-center text-sm">
              {isExpired ? (
                <XCircle className="h-4 w-4 text-red-500 mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              )}
              <span className={isExpired ? "text-red-400" : "text-green-400"}>
                {isExpired ? `Expired on ${new Date(poll.expiresAt!).toLocaleDateString()}` : "Active"}
              </span>
            </div>
          </div>
        </div>
        
        {/* 4. ADD 'relative z-10' TO BUTTONS WRAPPER */}
        <div className="relative z-10 flex items-center gap-3">
          <Link
            to={`/results/${poll.pollCode}`}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <BarChart2 className="h-5 w-5" />
            View Results
          </Link>
          <button
            onClick={() => setShowQrModal(true)}
            className="p-3 text-slate-400 bg-slate-800 rounded-lg hover:bg-cyan-900 hover:text-cyan-300 transition-colors"
            title="Show QR Code"
          >
            <QrCode className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(poll.pollCode)}
            className="p-3 text-slate-400 bg-slate-800 rounded-lg hover:bg-red-900 hover:text-red-300 transition-colors"
            title="Delete poll"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* 5. ADD THE METEORS COMPONENT INSIDE THE CARD */}
        <Meteors number={10} />
      </div>

      {/* --- QR Code Modal (no changes) --- */}
      {showQrModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowQrModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-black">Scan to Vote</h3>
              <button 
                onClick={() => setShowQrModal(false)}
                className="p-1 text-gray-500 hover:text-black"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <img src={poll.qrUrl} alt="Poll QR Code" className="w-64 h-64" />
            
            <p className="text-center text-sm text-gray-600 mt-4">
              Or copy the link below:
            </p>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                readOnly
                value={voteUrl}
                className="w-full truncate text-sm bg-gray-100 px-3 py-2 rounded-md border border-gray-300 text-gray-700"
              />
              <button
                onClick={() => handleCopy(voteUrl)}
                className="p-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                title="Copy link"
              >
                {isCopied ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}