import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";
import portfolioData from "@/data/portfolio.json";

const Contact = () => {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="fade-in">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Let's <span className="gradient-text">Connect</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-12">
              Interested in collaborating or discussing a project? Reach out to me!
            </p>

            <div className="glass-card p-12 rounded-2xl space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <a
                  href={`https://${portfolioData.profile.contact.linkedinProfile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-6 rounded-xl hover-lift flex flex-col items-center gap-4 group"
                >
                  <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Linkedin className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold mb-1">LinkedIn</p>
                    <p className="text-sm text-muted-foreground">Connect with me</p>
                  </div>
                </a>

                <a
                  href={portfolioData.profile.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-6 rounded-xl hover-lift flex flex-col items-center gap-4 group"
                >
                  <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Github className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold mb-1">GitHub</p>
                    <p className="text-sm text-muted-foreground">View my code</p>
                  </div>
                </a>

                <a
                  href="mailto:contact@sumitmitra.dev"
                  className="glass-card p-6 rounded-xl hover-lift flex flex-col items-center gap-4 group"
                >
                  <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold mb-1">Email</p>
                    <p className="text-sm text-muted-foreground">Send a message</p>
                  </div>
                </a>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">
                  📍 Based in {portfolioData.profile.location}
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                  <span>{portfolioData.profile.stats.connections}+ connections</span>
                  <span>•</span>
                  <span>{portfolioData.profile.stats.followers} followers</span>
                  <span>•</span>
                  <span>Open to opportunities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
