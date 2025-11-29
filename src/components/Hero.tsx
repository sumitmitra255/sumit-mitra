import { Button } from "@/components/ui/button";
import { Github, Linkedin, ArrowDown } from "lucide-react";
import portfolioData from "@/data/portfolio.json";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };
  // okay
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10 animate-gradient"></div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center fade-in">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 glass-card text-sm font-medium text-primary mb-4 rounded-full">
              {portfolioData.profile.location}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
            Hi, I'm{" "}
            <span className="gradient-text">{portfolioData.profile.name}</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-4">
            {portfolioData.profile.title}
          </p>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            {portfolioData.profile.headline}
          </p>

          <div className="flex flex-wrap gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              onClick={() => scrollToSection("experience")}
              className="font-heading font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              View My Work
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("contact")}
              className="font-heading font-semibold glass-card hover-lift"
            >
              Get In Touch
            </Button>
          </div>

          <div className="flex gap-4 justify-center">
            <a
              href={portfolioData.profile.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-3 rounded-full hover-lift inline-flex items-center justify-center"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={`https://${portfolioData.profile.contact.linkedinProfile}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-3 rounded-full hover-lift inline-flex items-center justify-center"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        <button
          onClick={() => scrollToSection("contact")}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce bg-transparent border-none cursor-pointer"
          aria-label="Scroll to contact section"
        >
          <ArrowDown className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
