import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, Info } from 'lucide-react';
import InteractiveMap from './InteractiveMap';

interface OfficeData {
  id: string;
  name: string;
  department: string;
  level: number;
  performance: 'excellent' | 'good' | 'poor';
  coordinates: { lat: number; lng: number };
  totalGrievances: number;
  resolvedGrievances: number;
  slaBreached: number;
}

interface OfficeMapProps {
  offices: OfficeData[];
}

export default function OfficeMap({ offices }: OfficeMapProps) {
  const [showInteractiveMap, setShowInteractiveMap] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState<OfficeData | null>(null);

  const performanceColors = {
    excellent: '#22c55e', // green
    good: '#eab308',      // yellow
    poor: '#ef4444'       // red
  };

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return '🟢';
      case 'good':
        return '🟡';
      case 'poor':
        return '🔴';
      default:
        return '⚪';
    }
  };

  if (!showInteractiveMap) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Office Performance Map
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                  Interactive Map Available
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                  View office locations on an interactive map powered by OpenStreetMap. No API key required!
                </p>
                <div className="space-y-2">
                  <h5 className="font-medium text-green-900 dark:text-green-100">Features:</h5>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• <strong>Interactive Map:</strong> Zoom, pan, and explore Dhaka</li>
                    <li>• <strong>Performance Markers:</strong> Color-coded office locations</li>
                    <li>• <strong>Detailed Popups:</strong> Click markers for office details</li>
                    <li>• <strong>Auto-fit Bounds:</strong> Automatically shows all offices</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-2">🟢</div>
              <p className="text-sm font-medium">Excellent Performance</p>
              <p className="text-xs text-muted-foreground">
                {offices.filter(o => o.performance === 'excellent').length} offices
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🟡</div>
              <p className="text-sm font-medium">Good Performance</p>
              <p className="text-xs text-muted-foreground">
                {offices.filter(o => o.performance === 'good').length} offices
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔴</div>
              <p className="text-sm font-medium">Poor Performance</p>
              <p className="text-xs text-muted-foreground">
                {offices.filter(o => o.performance === 'poor').length} offices
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setShowInteractiveMap(true)} className="flex-1">
              <MapPin className="h-4 w-4 mr-2" />
              View Interactive Map
            </Button>
            <Button variant="outline" asChild>
              <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                About OpenStreetMap
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Interactive Map - Office Performance</h3>
        <Button variant="outline" onClick={() => setShowInteractiveMap(false)}>
          <Info className="h-4 w-4 mr-2" />
          Back to Info
        </Button>
      </div>
      
      <InteractiveMap offices={offices} />
    </div>
  );
}
