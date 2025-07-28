function Footer() {
  return (
    <footer className="bg-muted py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Yoga Pose AI</h3>
            <p className="text-muted-foreground">
              Enhance your yoga practice with real-time AI feedback and guidance.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/practice" className="text-muted-foreground hover:text-primary">
                  Start Practice
                </a>
              </li>
              <li>
                <a href="/poses" className="text-muted-foreground hover:text-primary">
                  Pose Library
                </a>
              </li>
              <li>
                <a href="/settings" className="text-muted-foreground hover:text-primary">
                  Settings
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-muted-foreground">
              Built with modern web technologies to help you achieve perfect yoga form 
              through AI-powered pose detection and real-time feedback.
            </p>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Yoga Pose AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
