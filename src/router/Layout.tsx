import { Outlet } from "react-router-dom";
import Header from "../pages/Header";
import { useEffect, useRef, useState } from "react";
import {
  cleanupDelayedPadding,
  handleDelayedPadding,
} from "../utils/delayedPadding";

const MainLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFullPadding, setShowFullPadding] = useState(true);
  const timeoutRef = useRef<number | null>(null);
  useEffect(() => {
    handleDelayedPadding(isScrolled, setShowFullPadding, timeoutRef, 700);
    return () => {
      cleanupDelayedPadding(timeoutRef);
    };
  }, [isScrolled]);
  return (
    <div className="flex flex-col min-h-screen bg-background  text-primary">
      {/* Sticky Top Navigation */}
      <Header setIsScrolled={setIsScrolled} />

      {/* Scrollable Body */}
      <main
        className={`flex-grow transition-all duration-500 ${
          showFullPadding ? "pt-20" : "pt-0"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
