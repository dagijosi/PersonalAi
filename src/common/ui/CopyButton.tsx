import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

// CopyButton Component
const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs text-light-text hover:text-light-background"
    >
      {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}{" "}
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

export default CopyButton;