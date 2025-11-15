import { Code2, Rocket, Users, Award } from "lucide-react";
import portfolioData from "@/data/portfolio.json";

const About = () => {
  const highlights = [
    {
      icon: Code2,
      title: "10+ Years Experience",
      description: "Building scalable solutions across startups and enterprises"
    },
    {
      icon: Rocket,
      title: "Cloud-Native Expert",
      description: "AWS, Kubernetes, and microservices architecture"
    },
    {
      icon: Users,
      title: "Team Leadership",
      description: "Mentoring developers and leading technical teams"
    },
    {
      icon: Award,
      title: "GenAI Integration",
      description: "Hugging Face and custom LLM pipelines"
    }
  ];

  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Passionate about engineering scalable, intelligent systems
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 fade-in">
              <p className="text-lg leading-relaxed">
                {portfolioData.profile.about}
              </p>
              
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-heading font-semibold text-xl mb-4">Current Role</h3>
                <div className="space-y-2">
                  <p className="font-semibold text-primary">{portfolioData.currentRole.position}</p>
                  <p className="text-muted-foreground">{portfolioData.currentRole.company}</p>
                  <p className="text-sm text-muted-foreground">{portfolioData.currentRole.duration}</p>
                  <p className="text-sm mt-3 leading-relaxed">{portfolioData.currentRole.description}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 fade-in">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="glass-card p-6 rounded-xl hover-lift"
                >
                  <item.icon className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-heading font-semibold mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
