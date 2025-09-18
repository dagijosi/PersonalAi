import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { cn } from "../../utils/cn";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className,
  overlayClassName,
  contentClassName,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4",
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={cn(
              "fixed inset-0 bg-black/50 backdrop-blur-sm",
              overlayClassName
            )}
            onClick={onClose}
          />
          <motion.div
            className={cn(
              "relative bg-card text-card-foreground rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto",
              contentClassName
            )}
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            exit={{ y: "100vh", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
          >
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h2 className="text-xl font-semibold">{title}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <FiX className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { Modal };
