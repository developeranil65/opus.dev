import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlaceholdersAndVanishInput } from './ui/PlaceholdersAndVanishInput';

export default function HeroPollForm() {
  const navigate = useNavigate();
  const [pollCode, setPollCode] = useState('');

  // Updated, more professional placeholders
  const placeholders = [
    "Enter Poll Code (e.g. AB1234)",
    "Joining a presentation?",
    "Enter your 6-character code",
    "Paste your code here to vote",
    "What's your poll code?"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPollCode(e.target.value);
  };
  
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = pollCode.trim().toUpperCase();
    if (code) {
      navigate(`/vote/${code}`);
    }
  };

  return (
    <PlaceholdersAndVanishInput
      placeholders={placeholders}
      onChange={handleChange}
      onSubmit={onSubmit}
    />
  );
}