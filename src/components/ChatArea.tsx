import { AnimatePresence, motion } from "framer-motion";
import { FiCpu, FiLoader, FiUser } from "react-icons/fi";
import { cn } from "../utils/cn";
import ReactMarkdown from "react-markdown";
import type { Message } from "../store/useChatStore";
import remarkGfm from "remark-gfm";
import markdownComponents from "./markdownComponents";
import CopyButton from "../common/ui/CopyButton";

interface ChatAreaProps {
  messages: Message[];
  isPending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const ChatArea = ({ messages, isPending, messagesEndRef }: ChatAreaProps) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scroll p-6 space-y-6">
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
          messages.map((msg: Message) => {
            const isChart =
              typeof msg.text === "string" &&
              /"type"\s*:\s*"(bar|line|pie)"/.test(msg.text);

            return (
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
                {/* Avatar */}
                {msg.sender === "ai" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg bg-light-background text-primary">
                    <FiCpu />
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={cn(
                    "text-sm leading-relaxed",
                    isChart ? "w-full" : "max-w-[75%]"
                  )}
                >
                  <div
                    className={cn(
                      "p-3 rounded-lg",
                      msg.sender === "user"
                        ? "bg-blue-500/20 text-primary"
                        : "bg-light-background text-primary"
                    )}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {typeof msg.text === "string"
                        ? msg.text
                        : JSON.stringify(msg.text, null, 2)}
                    </ReactMarkdown>
                  </div>

                  {/* Copy button only for text, not charts */}
                  {!isChart && (
                    <div className="mt-1 flex justify-end">
                      <CopyButton
                        text={
                          typeof msg.text === "string"
                            ? msg.text.trim()
                            : JSON.stringify(msg.text, null, 2)
                        }
                      />
                    </div>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg bg-blue-500/20 text-primary">
                    <FiUser />
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </AnimatePresence>

      {isPending && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg bg-light-background text-gray-300">
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
  );
};

export default ChatArea;
