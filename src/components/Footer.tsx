import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-border bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              © {new Date().getFullYear()} Sumit Mitra. 
              <Heart className="w-4 h-4 text-primary fill-primary" /> 
            </p>
            <p className="text-sm text-muted-foreground">
              Turning ideas into scalable solutions
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
