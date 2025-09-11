import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Shield, 
  Search, 
  Database, 
  Network, 
  Hash,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import BlockchainDashboard from '@/components/BlockchainDashboard';
import CaseTransparencyPortal from '@/components/CaseTransparencyPortal';

const BlockchainTransparency: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleExploreCases = () => {
    setActiveTab('transparency');
  };

  const handleViewOnExplorer = () => {
    // Open blockchain explorer in new tab
    const explorerUrl = 'https://www.oklink.com/amoy';
    window.open(explorerUrl, '_blank');
  };

  return (
    <Layout>
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Blockchain Transparency
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience the future of transparent and verifiable legal case management. 
          Our blockchain-based system ensures immutability, credibility, and public verification.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="outline" className="px-3 py-1">
            <Network className="h-3 w-3 mr-1" />
            Polygon Amoy Testnet
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Database className="h-3 w-3 mr-1" />
            Real-time Updates
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Shield className="h-3 w-3 mr-1" />
            Immutable Records
          </Badge>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 hover:shadow-lg hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-foreground">Live Blockchain Status</CardTitle>
            <CardDescription>
              Real-time monitoring of blockchain network status, gas prices, and transaction activity
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 hover:shadow-lg hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-success" />
            </div>
            <CardTitle className="text-foreground">Case Verification Portal</CardTitle>
            <CardDescription>
              Public verification portal for cases and evidence with blockchain proof
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 hover:shadow-lg hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-tertiary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Hash className="h-6 w-6 text-tertiary" />
            </div>
            <CardTitle className="text-foreground">Audit Trail</CardTitle>
            <CardDescription>
              Complete audit trail and transaction history for all legal actions
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Blockchain Dashboard
          </TabsTrigger>
          <TabsTrigger value="transparency" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Case Transparency
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <BlockchainDashboard />
        </TabsContent>

        <TabsContent value="transparency" className="space-y-6">
          <CaseTransparencyPortal />
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Ready to Experience Transparency?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join us in building a more transparent and credible legal system. 
            Our blockchain technology ensures that every action is verifiable and immutable.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleExploreCases}
            >
              Explore Cases
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary/20 text-primary hover:bg-primary/10"
              onClick={handleViewOnExplorer}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Explorer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Technical Information */}
      <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Database className="h-5 w-5" />
            Technical Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-foreground">Blockchain Network</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network:</span>
                  <span className="font-mono text-foreground">Polygon Amoy Testnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chain ID:</span>
                  <span className="font-mono text-foreground">80002</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Consensus:</span>
                  <span className="text-foreground">Proof of Stake</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Block Time:</span>
                  <span className="text-foreground">~2 seconds</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-foreground">Smart Contract</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language:</span>
                  <span className="text-foreground">Solidity 0.8.24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Standard:</span>
                  <span className="text-foreground">ERC-20 Compatible</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Security:</span>
                  <span className="text-foreground">Access Control</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Upgradeable:</span>
                  <span className="text-foreground">Yes</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </Layout>
  );
};

export default BlockchainTransparency;
