import { Badge } from "@/components/ui/badge";
import portfolioData from "@/data/portfolio.json";

const Skills = () => {
  const skillCategories = [
    {
      title: "Languages & Frameworks",
      skills: ["Python", "JavaScript", "Node.js", "React", "Next.js", "Golang", "Rust", "PHP", "Java"]
    },
    {
      title: "AI & Machine Learning",
      skills: ["Generative AI Tools", "Transformers", "Hugging Face", "NumPy", "Pandas", "SciPy", "Matplotlib"]
    },
    {
      title: "Cloud & DevOps",
      skills: ["AWS", "Kubernetes", "Docker", "AWS Lambda", "AWS ECS", "AWS RDS", "CloudFormation", "Ansible", "CI/CD"]
    },
    {
      title: "Architecture & Design",
      skills: ["Microservices", "Event-Driven Architecture", "CQRS", "System Design", "Kafka", "RabbitMQ", "API Gateway"]
    },
    {
      title: "Databases & Tools",
      skills: ["MongoDB", "PostgreSQL", "Redis", "FastAPI", "Fastify.js", "WordPress", "headless CMS"]
    }
  ];

  return (
    <section id="skills" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Technical <span className="gradient-text">Skills</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Expertise across the full technology stack
            </p>
          </div>

          <div className="space-y-8">
            {skillCategories.map((category, index) => (
              <div
                key={index}
                className="glass-card p-8 rounded-2xl fade-in hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-xl font-heading font-semibold mb-4 text-primary">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge 
                      key={skillIndex} 
                      variant="secondary" 
                      className="px-4 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="glass-card inline-block px-6 py-3 rounded-full">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">{portfolioData.allSkills.length}+</span> technologies and tools
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
