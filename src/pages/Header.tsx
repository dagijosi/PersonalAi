import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useScrollTrigger } from "../utils/scroll";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  setIsScrolled: (scrolled: boolean) => void;
}

const Header = ({ setIsScrolled }: HeaderProps) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setLocalIsScrolled] = useState(false);
  const [scrolledWidth, setScrolledWidth] = useState("70%");

  useEffect(() => {
    const handleResize = () => {
      setScrolledWidth(window.innerWidth < 850 ? "95%" : "70%");
    };

    handleResize(); // set on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Use a local handler to update both local and parent state
  useScrollTrigger((scrolled: boolean) => {
    setLocalIsScrolled(scrolled);
    setIsScrolled(scrolled);
  }, 50);

  const linkClasses = (path: string) =>
    `px-3 py-2 border border-primary/20 rounded hover:bg-primary/20 transition-colors ${
      location.pathname === path ? "bg-primary/30 font-semibold" : ""
    }`;
  return (
    <motion.header
      initial="top"
      animate={isScrolled ? "scrolled" : "top"}
      variants={{
        top: {
          width: "100%",
          marginTop: "0rem",
          borderRadius: "0rem",
          backgroundColor: "rgba(var(--color-secondary-rgb), 0.8)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        },
        scrolled: {
          width: scrolledWidth,
          marginTop: "1rem",
          borderRadius: "1rem",
          backgroundColor: "rgba(var(--color-secondary-rgb), 0.7)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        },
      }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="fixed z-50 -translate-x-1/2 left-1/2"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="text-xl font-bold font-poppins">
            Personal AI Workspace
          </Link>
          <nav className="hidden space-x-1 lg:flex">
            <Link to="/tasks" className={linkClasses("/tasks")}>
              Tasks
            </Link>
            <Link to="/notes" className={linkClasses("/notes")}>
              Notes
            </Link>
            <Link to="/settings" className={linkClasses("/settings")}>
              Settings
            </Link>
          </nav>
          {/* Mobile Menu Toggle */}
          <button
            className="p-3 transition-colors duration-500 shadow-lg lg:hidden rounded-2xl hover:bg-blue-50 hover:shadow-xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="text-gray-600 h-7 w-7" />
            ) : (
              <Menu className="text-gray-600 h-7 w-7" />
            )}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`absolute left-0 right-0 border-b shadow-2xl lg:hidden top-full bg-secondary/90 backdrop-blur-xl border-blue-100/50 ${
            isScrolled && "rounded-2xl"
          }`}
        >
          <div className="px-6 py-8 space-x-3 text-center">
            <Link to="/tasks" className={linkClasses("/tasks")}>
              Tasks
            </Link>
            <Link to="/notes" className={linkClasses("/notes")}>
              Notes
            </Link>
            <Link to="/settings" className={linkClasses("/settings")}>
              Settings
            </Link>
          </div>
        </div>
      )}
    </motion.header>
  );
};

export default Header;
