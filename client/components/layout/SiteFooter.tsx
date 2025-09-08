export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-foreground/70">
          © {new Date().getFullYear()} SmartMeal. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-sm">
          <a className="hover:text-foreground" href="#features">
            Features
          </a>
          <a className="hover:text-foreground" href="#how">
            How it works
          </a>
          <a className="hover:text-foreground" href="#faq">
            FAQ
          </a>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
