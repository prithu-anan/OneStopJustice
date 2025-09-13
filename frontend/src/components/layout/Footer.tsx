import { Link } from 'react-router-dom';
import { Scale, Shield, Users, Gavel } from 'lucide-react';
// Using stop.png from public folder

export const Footer = () => {
  return (
    <footer className="bg-primary/10 dark:bg-muted/50 border-t">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/stop.png" alt="QuickSolve" className="h-8 w-8" />
              <span className="font-bold text-lg text-foreground">QuickSolve</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Revolutionizing governance through transparent, efficient, and accessible solutions.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/complaints" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  File Complaints
                </Link>
              </li>
              <li>
                <Link to="/cases" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Gavel className="h-3 w-3" />
                  Track Cases
                </Link>
              </li>
              <li>
                <Link to="/lawyers" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Users className="h-3 w-3" />
                  Find Lawyers
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Scale className="h-3 w-3" />
                  About Justice
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/compliance" className="hover:text-primary transition-colors">
                  Compliance
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-primary transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Emergency: 999</li>
              <li>Support: 1247</li>
              <li>Email: support@quicksolve.gov</li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact Form
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2025 QuickSolve. All rights reserved.</p>
          <p>Powered by blockchain technology for transparent solutions.</p>
        </div>
      </div>
    </footer>
  );
};