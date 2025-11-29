import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, MapPin, Briefcase } from "lucide-react";
import portfolioData from "@/data/portfolio.json";

interface ExperienceItem {
  position: string;
  company: string;
  duration: string;
  location?: string;
  employmentType: string;
  description: string;
}

const TimelineItem = ({
  exp,
  index,
}: {
  exp: ExperienceItem;
  index: number;
}) => {
  return (
    <li
      className="mb-10 ml-6 relative fade-in"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* Timeline Dot */}
      <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-8 ring-background shadow-lg z-10">
        <Briefcase className="w-4 h-4 text-primary-foreground" />
      </span>

      {/* Experience Card */}
      <div className="glass-card p-6 md:p-8 rounded-2xl hover-lift border border-border/50">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-heading font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
              {exp.position}
            </h3>

            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">{exp.company}</span>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                <Calendar className="w-3.5 h-3.5" />
                <span>{exp.duration}</span>
              </div>
              {exp.location && (
                <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{exp.location}</span>
                </div>
              )}
            </div>
          </div>

          <Badge
            variant="secondary"
            className="self-start shrink-0 bg-primary/10 text-primary border-primary/20"
          >
            {exp.employmentType}
          </Badge>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {exp.description}
        </p>
      </div>
    </li>
  );
};

const Experience = () => {
  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Career <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Over a decade of building scalable solutions and leading technical
              teams
            </p>
          </div>

          <div className="relative pl-4 md:pl-8">
            <ol className="relative border-l-2 border-primary/20 space-y-12">
              {portfolioData.experience.map((exp, index) => (
                <TimelineItem key={index} exp={exp} index={index} />
              ))}
            </ol>
          </div>

          {/* Summary stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-6 rounded-xl text-center hover-lift">
              <div className="text-3xl font-heading font-bold text-primary mb-1">
                10+
              </div>
              <div className="text-sm text-muted-foreground">
                Years Experience
              </div>
            </div>
            <div className="glass-card p-6 rounded-xl text-center hover-lift">
              <div className="text-3xl font-heading font-bold text-primary mb-1">
                {portfolioData.experience.length}
              </div>
              <div className="text-sm text-muted-foreground">Key Roles</div>
            </div>
            <div className="glass-card p-6 rounded-xl text-center hover-lift">
              <div className="text-3xl font-heading font-bold text-primary mb-1">
                8+
              </div>
              <div className="text-sm text-muted-foreground">
                Major Projects
              </div>
            </div>
            <div className="glass-card p-6 rounded-xl text-center hover-lift">
              <div className="text-3xl font-heading font-bold text-primary mb-1">
                {portfolioData.allSkills.length}+
              </div>
              <div className="text-sm text-muted-foreground">Technologies</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
