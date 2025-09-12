import { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface InteractiveMapProps {
  offices: OfficeData[];
}

export default function InteractiveMap({ offices }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<OfficeData | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Dhaka center coordinates
  const dhakaCenter = [23.8103, 90.4125];

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

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return '#22c55e';
      case 'good':
        return '#eab308';
      case 'poor':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current || isMapLoaded || mapInstanceRef.current) return;

      try {
        setMapError(null);
        
        // Load Leaflet CSS first
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
        link.integrity = 'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==';
        link.crossOrigin = '';
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
        script.integrity = 'sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==';
        script.crossOrigin = '';
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });

        // Now use Leaflet
        const L = (window as any).L;
        
        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Create map
        const map = L.map(mapRef.current).setView(dhakaCenter, 11);
        mapInstanceRef.current = map;

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Create custom markers for each office
        const markers: any[] = [];
        offices.forEach((office) => {
          const color = getPerformanceColor(office.performance);
          
          // Create custom icon
          const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background-color: ${color};
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 10px;
              cursor: pointer;
            "></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });

          // Create popup content
          const popupContent = `
            <div style="padding: 8px; min-width: 192px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="font-size: 18px;">${getPerformanceIcon(office.performance)}</span>
                <h4 style="font-weight: 600; font-size: 14px; margin: 0;">${office.name}</h4>
              </div>
              <p style="font-size: 12px; color: #666; margin: 0 0 8px 0;">${office.department} • Level ${office.level}</p>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; font-size: 12px;">
                <div style="text-align: center;">
                  <div style="font-weight: bold;">${office.totalGrievances}</div>
                  <div style="color: #666;">Total</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-weight: bold; color: #22c55e;">${office.resolvedGrievances}</div>
                  <div style="color: #666;">Resolved</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-weight: bold; color: #ef4444;">${office.slaBreached}</div>
                  <div style="color: #666;">SLA Breach</div>
                </div>
              </div>
            </div>
          `;

          // Create marker
          const marker = L.marker([office.coordinates.lat, office.coordinates.lng], {
            icon: customIcon
          }).addTo(map);

          // Add popup
          marker.bindPopup(popupContent);

          // Add click handler
          marker.on('click', () => {
            setSelectedOffice(office);
          });

          markers.push(marker);
        });

        markersRef.current = markers;

        // Fit map bounds to show all markers
        if (offices.length > 0) {
          const group = new L.featureGroup(markers);
          map.fitBounds(group.getBounds().pad(0.1));
        }

        setIsMapLoaded(true);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to load map. Please refresh the page.');
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeMap, 100);
    return () => clearTimeout(timer);
  }, [offices, isMapLoaded]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span>Excellent</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span>Good</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span>Poor</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <div className="h-[500px] rounded-lg overflow-hidden border relative">
          <div 
            ref={mapRef} 
            className="w-full h-full"
          />
          {!isMapLoaded && !mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
          )}
          {mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50">
              <div className="text-center">
                <div className="text-red-500 text-2xl mb-2">⚠️</div>
                <p className="text-sm text-red-600">{mapError}</p>
              </div>
            </div>
          )}
        </div>

        {/* Office List */}
        <div className="space-y-4 h-[500px] flex flex-col">
          <h4 className="font-medium">Office Performance Summary</h4>
          <div className="space-y-2 flex-1 overflow-y-auto">
            {offices.map((office) => (
              <Card 
                key={office.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedOffice?.id === office.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedOffice(office)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getPerformanceIcon(office.performance)}</span>
                        <h5 className="font-medium">{office.name}</h5>
                        <Badge variant="outline" className="text-xs">
                          L{office.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{office.department}</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="font-medium">Total:</span> {office.totalGrievances}
                        </div>
                        <div>
                          <span className="font-medium">Resolved:</span> {office.resolvedGrievances}
                        </div>
                        <div>
                          <span className="font-medium">SLA Breach:</span> {office.slaBreached}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Office Details */}
      {selectedOffice && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>{getPerformanceIcon(selectedOffice.performance)}</span>
              {selectedOffice.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-medium">Department:</span> {selectedOffice.department}</p>
              <p><span className="font-medium">Level:</span> {selectedOffice.level}</p>
              <p><span className="font-medium">Coordinates:</span> {selectedOffice.coordinates.lat.toFixed(4)}, {selectedOffice.coordinates.lng.toFixed(4)}</p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm font-medium">Total Grievances</p>
                  <p className="text-2xl font-bold">{selectedOffice.totalGrievances}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{selectedOffice.resolvedGrievances}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}