import { AnimatePresence, motion } from 'framer-motion'
import { FiCpu, FiLoader, FiUser } from 'react-icons/fi'
import { cn } from '../utils/cn'
import CopyButton from '../common/ui/CopyButton'
import ReactMarkdown from "react-markdown";
import type { Message } from '../store/useChatStore';
import remarkGfm from "remark-gfm";
import markdownComponents from './markdownComponents';

interface ChatAreaProps {
  messages: Message[];
  isPending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}
const isLongResearchText = (text: string) => {
  return text.length > 300 && !/```|\n\s*[-*]|^#{1,3}\s/m.test(text);
};
const ChatArea = ({ messages, isPending, messagesEndRef }: ChatAreaProps) => {
  return (
      <div className="flex-1 h-[24rem] lg:h-[26rem] overflow-y-auto custom-scroll p-6 space-y-6 ">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-gray-500 mt-8"
            >
              <FiCpu className="mx-auto text-5xl mb-4 text-gray-600" />
              <h2 className="text-lg font-medium text-gray-400">Gemini AI</h2>
              <p className="text-sm">Start the conversation by typing below.</p>
            </motion.div>
          ) : (
            messages.map((msg: Message) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex items-start gap-4",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.sender === "ai" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg bg-gray-700 text-gray-300">
                    <FiCpu />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[75%] p-3 rounded-lg text-sm leading-relaxed",
                    msg.sender === "user"
                      ? "bg-blue-500/20 text-primary"
                      : "bg-gray-800 text-gray-200"
                  )}
                >
                  {isLongResearchText(msg.text) ? (
                    <div className="bg-gray-900 border border-gray-700 rounded-md p-3 relative">
                      <div className="absolute top-2 right-2">
                        <CopyButton text={msg.text} />
                      </div>
                      <p className="whitespace-pre-wrap text-gray-300 text-sm">
                        {msg.text}
                      </p>
                    </div>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  )}
                </div>
                {msg.sender === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg bg-blue-500/20 text-primary">
                    <FiUser />
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {isPending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-4"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg bg-gray-700 text-gray-300">
              <FiCpu />
            </div>
            <div className="flex-1 pt-2 flex items-center gap-2">
              <FiLoader className="animate-spin text-blue-400" />
              <span className="text-sm text-gray-400 animate-pulse">
                AI is thinking...
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>
  )
}

export default ChatArea