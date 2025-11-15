import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, MapPin, Briefcase } from "lucide-react";
import portfolioData from "@/data/portfolio.json";

const Experience = () => {
  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Career <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Over a decade of building scalable solutions and leading technical teams
            </p>
          </div>

          <div className="relative">
            {/* Timeline vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent"></div>

            <div className="space-y-12">
              {portfolioData.experience.map((exp, index) => (
                <div
                  key={index}
                  className={`relative fade-in hover-lift ${
                    index % 2 === 0 ? "md:pr-1/2" : "md:pl-1/2 md:ml-auto"
                  }`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg z-10">
                    <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
                  </div>

                  {/* Experience card */}
                  <div
                    className={`ml-20 md:ml-0 glass-card p-8 rounded-2xl group cursor-pointer ${
                      index % 2 === 0 ? "md:mr-16" : "md:ml-16"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="w-5 h-5 text-primary" />
                          <h3 className="text-xl font-heading font-bold group-hover:text-primary transition-colors">
                            {exp.position}
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <Building2 className="w-4 h-4" />
                          <span className="font-medium">{exp.company}</span>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{exp.duration}</span>
                          </div>
                          {exp.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{exp.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Badge 
                        variant="secondary" 
                        className="shrink-0 bg-primary/10 text-primary border-primary/20"
                      >
                        {exp.employmentType}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Hover indicator */}
                    <div className="mt-4 pt-4 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs text-primary font-medium">
                        Click to learn more →
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-6 rounded-xl text-center hover-lift">
              <div className="text-3xl font-heading font-bold text-primary mb-1">10+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="glass-card p-6 rounded-xl text-center hover-lift">
              <div className="text-3xl font-heading font-bold text-primary mb-1">{portfolioData.experience.length}</div>
              <div className="text-sm text-muted-foreground">Key Roles</div>
            </div>
            <div className="glass-card p-6 rounded-xl text-center hover-lift">
              <div className="text-3xl font-heading font-bold text-primary mb-1">{portfolioData.projects.length}</div>
              <div className="text-sm text-muted-foreground">Major Projects</div>
            </div>
            <div className="glass-card p-6 rounded-xl text-center hover-lift">
              <div className="text-3xl font-heading font-bold text-primary mb-1">{portfolioData.allSkills.length}+</div>
              <div className="text-sm text-muted-foreground">Technologies</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
