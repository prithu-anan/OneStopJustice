import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Scale, Users, Gavel, CheckCircle, FileText, Clock, BarChart3, Brain, MapPin, Search, MessageCircle, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Using stop.png from public folder

export const Landing = () => {
  const features = [
    {
      icon: FileText,
      title: 'File Complaints',
      description: 'Submit complaints digitally with complete documentation and evidence management.',
      color: 'text-primary'
    },
    {
      icon: BarChart3,
      title: 'Metadata Analysis',
      description: 'Advanced data analysis to identify patterns and insights in case information.',
      color: 'text-secondary'
    },
    {
      icon: Brain,
      title: 'AI based Auto Routing',
      description: 'Intelligent case routing and assignment based on AI analysis and expertise matching.',
      color: 'text-warning'
    },
    {
      icon: Search,
      title: 'Track Progress',
      description: 'Real-time updates on your case status from complaint to resolution.',
      color: 'text-success'
    },
    {
      icon: MessageCircle,
      title: 'Effortless Legal Connections',
      description: 'Seamlessly connect with qualified legal professionals and case stakeholders.',
      color: 'text-tertiary'
    },
    {
      icon: MapPin,
      title: 'Real Time Spatial Data Visualization',
      description: 'Interactive maps and spatial analytics for comprehensive case understanding.',
      color: 'text-danger'
    }
  ];

  const benefits = [
    'Digital complaint filing with evidence upload',
    'Real-time case tracking and notifications',
    'Transparent investigation process',
    'Direct professional communication',
    'Blockchain-secured document storage',
    'Automated case scheduling'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-tertiary/20 dark:from-secondary/30 dark:to-tertiary/30" />
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />
        
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer"></div>
        
        <div className="container relative z-10 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="flex justify-center mb-8">
              <img src="/stop.png" alt="QuickSolve" className="h-24 w-24 animate-float" />
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
              QuickSolve
            </h1>
            <h2 className="text-2xl lg:text-4xl font-semibold text-white/95 drop-shadow-lg tracking-wide">
              Where Trust meets Action
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto">
              One Stop Platform for all Governance Services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="btn-hero text-lg px-8 py-4 text-white font-bold" asChild>
                <Link to="/register">
                  Start Your Case
                  <ArrowRight className="ml-2 h-5 w-5 text-white" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-black dark:text-white border-white hover:bg-white dark:hover:bg-white/10 hover:text-primary text-lg px-8 py-4 shadow-lg" asChild>
                <Link to="/login">
                  Access Portal
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background/95 dark:bg-background">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Complete Governance Ecosystem
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From complaint filing to resolution delivery, experience solutions that are transparent, efficient, and accessible to all.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 hover:shadow-elegant hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 group cursor-pointer backdrop-blur-sm">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-current/10 to-current/20 flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Taglines Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Choose QuickSolve?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of governance with our innovative platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Streamlined & Impactful */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Streamlined & Impactful
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-white/50 dark:bg-white/10 rounded-lg border border-primary/20 dark:border-primary/30 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-all duration-300">
                  <p className="font-medium text-foreground">Justice Made Easy: Connect with Courts, Cops & Counsel</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-white/10 rounded-lg border border-primary/20 dark:border-primary/30 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-all duration-300">
                  <p className="font-medium text-foreground">Effortless Legal Access—Judiciary, Law Enforcement & Lawyers</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-white/10 rounded-lg border border-primary/20 dark:border-primary/30 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-all duration-300">
                  <p className="font-medium text-foreground">One Link to Law: Hassle-Free Legal Connections</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-white/10 rounded-lg border border-primary/20 dark:border-primary/30 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-all duration-300">
                  <p className="font-medium text-foreground">Your Gateway to Justice—Fast, Simple, Reliable</p>
                </div>
              </div>
            </div>

            {/* Bold & Catchy */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center">
                <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
                Bold & Catchy
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-white/50 dark:bg-white/10 rounded-lg border border-secondary/20 dark:border-secondary/30 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-all duration-300">
                  <p className="font-medium text-foreground">Click. Connect. Comply.</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-white/10 rounded-lg border border-secondary/20 dark:border-secondary/30 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-all duration-300">
                  <p className="font-medium text-foreground">Justice Without the Jargon</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-white/10 rounded-lg border border-secondary/20 dark:border-secondary/30 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-all duration-300">
                  <p className="font-medium text-foreground">Law Made Simple—From Courtroom to Counsel</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-white/10 rounded-lg border border-secondary/20 dark:border-secondary/30 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-all duration-300">
                  <p className="font-medium text-foreground">No Barriers. Just Justice.</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-white/10 rounded-lg border border-secondary/20 dark:border-secondary/30 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-all duration-300">
                  <p className="font-medium text-foreground">Swift Justice Starts Here</p>
                </div>
              </div>
            </div>

            {/* Additional Benefits */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-warning mb-4 flex items-center">
                <div className="w-2 h-2 bg-warning rounded-full mr-3"></div>
                Platform Benefits
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-white/50 dark:bg-white/10 rounded-lg border border-warning/20 dark:border-warning/30 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-all duration-300">
                  <p className="font-medium text-foreground">24/7 Digital Access</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-white/10 rounded-lg border border-warning/20 dark:border-warning/30 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-all duration-300">
                  <p className="font-medium text-foreground">Blockchain Security</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-white/10 rounded-lg border border-warning/20 dark:border-warning/30 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-all duration-300">
                  <p className="font-medium text-foreground">AI-Powered Efficiency</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-white/10 rounded-lg border border-warning/20 dark:border-warning/30 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-all duration-300">
                  <p className="font-medium text-foreground">Real-Time Updates</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-white/10 rounded-lg border border-warning/20 dark:border-warning/30 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-all duration-300">
                  <p className="font-medium text-foreground">Transparent Process</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-primary/3 dark:bg-primary/5">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Our Mission & Vision
              </h2>
              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-primary">Our Mission</h3>
                  <p className="text-lg text-muted-foreground">
                    To provide every citizen with quick, fair, and transparent solutions to their problems.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-primary">Our Vision</h3>
                  <p className="text-lg text-muted-foreground">
                    To ensure accountable, tamper-proof, and accessible solutions for all, everywhere.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 p-6 text-center backdrop-blur-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300">
                <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                <div className="text-muted-foreground">Cases Resolved</div>
              </Card>
              <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 p-6 text-center backdrop-blur-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300">
                <div className="text-3xl font-bold text-secondary mb-2">24/7</div>
                <div className="text-muted-foreground">System Availability</div>
              </Card>
              <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 p-6 text-center backdrop-blur-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300">
                <div className="text-3xl font-bold text-warning mb-2">500+</div>
                <div className="text-muted-foreground">Legal Professionals</div>
              </Card>
              <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 p-6 text-center backdrop-blur-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300">
                <div className="text-3xl font-bold text-success mb-2">99.9%</div>
                <div className="text-muted-foreground">Data Security</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Role-based Access */}
      <section className="py-20 bg-background/95 dark:bg-background">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Access For Every Role
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tailored interfaces and features for each stakeholder in the governance system.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <Card className="relative overflow-hidden bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-xl hover:shadow-2xl hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-500 group hover:scale-105 transform perspective-1000 hover:rotate-y-2 flex flex-col backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700"></div>
              <CardHeader className="text-center pb-4 pt-6 bg-gradient-to-br from-card to-muted/30 flex-1">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <Badge className="w-fit mx-auto mb-6 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 font-semibold px-4 py-2 rounded-full border border-orange-200 dark:border-orange-700 group-hover:bg-orange-200 dark:group-hover:bg-orange-800/50 group-hover:scale-105 transition-all duration-300">Citizens</Badge>
                <CardTitle className="text-xl font-bold text-foreground">For Citizens</CardTitle>
                <CardDescription className="text-sm leading-relaxed mt-3 text-muted-foreground">
                  File complaints, track cases, find professionals, and stay updated on proceedings.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 pb-6 px-6 mt-auto">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 hover:from-orange-600 hover:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl" asChild>
                  <Link to="/register?role=citizen">Register as Citizen</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-xl hover:shadow-2xl hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-500 group hover:scale-105 transform perspective-1000 hover:rotate-y-2 flex flex-col backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700"></div>
              <CardHeader className="text-center pb-4 pt-6 bg-gradient-to-br from-card to-muted/30 flex-1">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <Badge className="w-fit mx-auto mb-6 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 font-semibold px-4 py-2 rounded-full border border-blue-200 dark:border-blue-700 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 group-hover:scale-105 transition-all duration-300">Law Enforcement</Badge>
                <CardTitle className="text-xl font-bold text-foreground">For Police</CardTitle>
                <CardDescription className="text-sm leading-relaxed mt-3 text-muted-foreground">
                  Manage investigations, file reports, submit evidence, and coordinate with authorities.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 pb-6 px-6 mt-auto">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl" asChild>
                  <Link to="/register?role=police">Register as Officer</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-xl hover:shadow-2xl hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-500 group hover:scale-105 transform perspective-1000 hover:rotate-y-2 flex flex-col backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700"></div>
              <CardHeader className="text-center pb-4 pt-6 bg-gradient-to-br from-card to-muted/30 flex-1">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Gavel className="h-8 w-8 text-white" />
                </div>
                <Badge className="w-fit mx-auto mb-6 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 font-semibold px-4 py-2 rounded-full border border-purple-200 dark:border-purple-700 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 group-hover:scale-105 transition-all duration-300">Judiciary</Badge>
                <CardTitle className="text-xl font-bold text-foreground">For Judges</CardTitle>
                <CardDescription className="text-sm leading-relaxed mt-3 text-muted-foreground">
                  Process reports, create cases, schedule hearings, and deliver decisions.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 pb-6 px-6 mt-auto">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 hover:from-purple-600 hover:to-purple-700 dark:hover:from-purple-700 dark:hover:to-purple-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl" asChild>
                  <Link to="/register?role=judge">Register as Judge</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-xl hover:shadow-2xl hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-500 group hover:scale-105 transform perspective-1000 hover:rotate-y-2 flex flex-col backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700"></div>
              <CardHeader className="text-center pb-4 pt-6 bg-gradient-to-br from-card to-muted/30 flex-1">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Scale className="h-8 w-8 text-white" />
                </div>
                <Badge className="w-fit mx-auto mb-6 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 font-semibold px-4 py-2 rounded-full border border-green-200 dark:border-green-700 group-hover:bg-green-200 dark:group-hover:bg-green-800/50 group-hover:scale-105 transition-all duration-300">Legal Profession</Badge>
                <CardTitle className="text-xl font-bold text-foreground">For Lawyers</CardTitle>
                <CardDescription className="text-sm leading-relaxed mt-3 text-muted-foreground">
                  Represent clients, submit documents, access case files, and communicate with all stakeholders.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 pb-6 px-6 mt-auto">
                <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl" asChild>
                  <Link to="/register?role=lawyer">Register as Lawyer</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />
        
        
        {/* Enhanced Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
        
        <div className="container px-4 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Experience Digital Solutions?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of citizens, professionals, and law enforcement officers using our platform for transparent and efficient solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-hero text-lg px-8 py-4 text-white font-bold" asChild>
              <Link to="/register">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5 text-white" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-black dark:text-white border-white hover:bg-white dark:hover:bg-white/10 hover:text-primary text-lg px-8 py-4 shadow-lg" asChild>
              <Link to="/contact">
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};