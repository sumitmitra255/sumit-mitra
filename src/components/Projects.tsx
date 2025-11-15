import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Users } from "lucide-react";
import portfolioData from "@/data/portfolio.json";

const Projects = () => {
  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Building real-world solutions that make an impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {portfolioData.projects.map((project, index) => (
              <div
                key={index}
                className="glass-card p-8 rounded-2xl hover-lift fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-heading font-bold mb-2">{project.name}</h3>
                  {project.company && (
                    <p className="text-sm text-muted-foreground mb-2">{project.company}</p>
                  )}
                  {project.duration && (
                    <p className="text-xs text-muted-foreground">{project.duration}</p>
                  )}
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary" className="font-medium">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  {project.url && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`https://${project.url}`, '_blank')}
                      className="group"
                    >
                      View Project
                      <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                  {project.contributors && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{project.contributors} contributors</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
