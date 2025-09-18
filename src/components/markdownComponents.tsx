import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import CopyButton from "../common/ui/CopyButton";
import { cn } from "../utils/cn";
import oneDark from "react-syntax-highlighter/dist/cjs/styles/prism";
import { type Components } from "react-markdown";
const markdownComponents: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return match ? (
      <div className="bg-gray-800 rounded-md my-4 font-mono overflow-hidden">
        <div className="flex items-center justify-between px-4 py-1 bg-gray-700 text-xs text-gray-400">
          <span>{match[1]}</span>
          <CopyButton text={String(children).trim()} />
        </div>
        <SyntaxHighlighter
          language={match[1]}
          style={oneDark}
          customStyle={{ margin: 0, padding: "1rem" }}
          PreTag="div"
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code
        className={cn(
          className,
          "bg-gray-700 text-red-400 rounded-sm px-1 py-0.5 text-xs font-mono"
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
};
export default markdownComponents;