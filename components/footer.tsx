export function Footer() {
  return (
    <footer className="w-full border-t border-border py-6 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-muted-foreground mb-4 md:mb-0">
          © {new Date().getFullYear()} Like Look Solutions. All rights reserved.
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <a 
            href="https://likelook.wixsite.com/solutions" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm hover:text-primary transition-colors"
          >
            Visit Our Website
          </a>
          <a 
            href="https://wa.me/5511970603441" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm hover:text-primary transition-colors"
          >
            Contact: +55 11 97060-3441
          </a>
        </div>
      </div>
    </footer>
  );
}