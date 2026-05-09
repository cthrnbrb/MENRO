import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import MonitoringNavFooter from "@/src/components/MonitoringNavFooter";

const { width, height } = Dimensions.get('window');

interface MapLocation {
  id: string;
  name: string;
  type: 'monitoring' | 'assignment' | 'completed';
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  trees: number;
}

const sampleLocations: MapLocation[] = [
  { id: '1', name: 'Green Earth Foundation', type: 'monitoring', x: 25, y: 30, trees: 45 },
  { id: '2', name: 'Community Tree Planters', type: 'assignment', x: 60, y: 45, trees: 32 },
  { id: '3', name: 'School Environmental Club', type: 'completed', x: 40, y: 70, trees: 28 },
  { id: '4', name: 'Corporate Green Initiative', type: 'monitoring', x: 75, y: 25, trees: 50 },
  { id: '5', name: 'Barangay Tree Project', type: 'assignment', x: 35, y: 55, trees: 15 },
  { id: '6', name: 'Municipal Park', type: 'completed', x: 55, y: 60, trees: 120 },
];

export default function MonitoringMapScreen() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'monitoring': return '#3b82f6';
      case 'assignment': return '#f59e0b';
      case 'completed': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'monitoring': return 'visibility';
      case 'assignment': return 'assignment';
      case 'completed': return 'check-circle';
      default: return 'place';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tree Monitoring Map</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.headerSubtitle}>Opol, Misamis Oriental</Text>
      </View>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ width: width * zoomLevel }}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ height: height * 0.6 * zoomLevel }}
          >
            <View style={[styles.mapArea, { transform: [{ scale: zoomLevel }] }]}>
              {/* Grid Lines */}
              <View style={styles.gridContainer}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <View key={`h-${i}`} style={[styles.gridLineHorizontal, { top: `${i * 10}%` }]} />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <View key={`v-${i}`} style={[styles.gridLineVertical, { left: `${i * 10}%` }]} />
                ))}
              </View>

              {/* Location Markers */}
              {sampleLocations.map((location) => (
                <TouchableOpacity
                  key={location.id}
                  style={[
                    styles.marker,
                    { left: `${location.x}%`, top: `${location.y}%` }
                  ]}
                  onPress={() => setSelectedLocation(location)}
                >
                  <View style={[styles.markerIcon, { backgroundColor: getMarkerColor(location.type) }]}>
                    <MaterialIcons 
                      name={getMarkerIcon(location.type) as any} 
                      size={16} 
                      color="#fff" 
                    />
                  </View>
                  <View style={styles.markerLabel}>
                    <Text style={styles.markerText}>{location.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Selected Location Info */}
              {selectedLocation && (
                <View style={[
                  styles.infoCard,
                  { left: `${Math.min(selectedLocation.x + 5, 70)}%`, top: `${Math.max(selectedLocation.y - 10, 5)}%` }
                ]}>
                  <View style={styles.infoHeader}>
                    <MaterialIcons 
                      name={getMarkerIcon(selectedLocation.type) as any} 
                      size={20} 
                      color={getMarkerColor(selectedLocation.type)} 
                    />
                    <Text style={styles.infoTitle}>{selectedLocation.name}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <MaterialIcons name="park" size={16} color="#6b7280" />
                    <Text style={styles.infoText}>{selectedLocation.trees} trees</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <MaterialIcons name="schedule" size={16} color="#6b7280" />
                    <Text style={styles.infoText}>Status: {selectedLocation.type}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.infoButton}
                    onPress={() => router.push("/monitoring/assignment")}
                  >
                    <Text style={styles.infoButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </ScrollView>

        {/* Zoom Controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity 
            style={styles.zoomButton}
            onPress={() => setZoomLevel(prev => Math.min(prev + 0.5, 3))}
          >
            <MaterialIcons name="add" size={24} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.zoomButton}
            onPress={() => setZoomLevel(prev => Math.max(prev - 0.5, 1))}
          >
            <MaterialIcons name="remove" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Legend</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
            <Text style={styles.legendText}>Monitoring</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.legendText}>Assignment</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
            <Text style={styles.legendText}>Completed</Text>
          </View>
        </View>
      </View>

      <MonitoringNavFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#10b981',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#e8f5e9',
    borderWidth: 2,
    borderColor: '#c8e6c9',
    position: 'relative',
  },
  mapArea: {
    width: width,
    height: height * 0.6,
    position: 'relative',
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  markerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  markerLabel: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  markerText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  infoCard: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
  },
  infoButton: {
    backgroundColor: '#10b981',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  infoButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  zoomControls: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    gap: 8,
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  legendContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
  },
});