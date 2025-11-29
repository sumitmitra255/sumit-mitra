import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";

const Navigation = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (route: string, sectionId: string) => {
    navigate(route);
    // Small delay to ensure navigation completes before scrolling
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    setIsOpen(false);
  };

  const navLinks = [
    { name: "Home", id: "home", route: "/home#home" },
    { name: "About", id: "about", route: "/home#about" },
    { name: "Experience", id: "experience", route: "/home#experience" },
    // { name: "Projects", id: "projects", route: "/home#projects" },
    { name: "Skills", id: "skills", route: "/home#skills" },
    { name: "Contact", id: "contact", route: "/home#contact" },
    { name: "Blog", id: "blog", route: "/blog" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-nav shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => handleNavigation("/home#home", "home")}
            className="font-heading font-bold text-xl hover:text-primary transition-colors"
          >
            {/* SM */}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavigation(link.route, link.id)}
                className="text-sm font-medium hover:text-primary transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </button>
            ))}
            <ThemeSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-in slide-in-from-top">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavigation(link.route, link.id)}
                  className="text-sm font-medium hover:text-primary transition-colors py-2 text-left"
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-2 border-t border-border/50 flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Theme
                </span>
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
