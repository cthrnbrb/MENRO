import { View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import MonitoringFooter from "@/src/components/MonitoringFooter";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "@/src/api/axios";
import { getToken } from "@/src/services/auth-storage";

interface MonitoringAssignment {
  id: string;
  activity_id: number;
  staff_id: number;
  target_year: number;
  target_quarter: number;
  scheduled_date: string;
  is_completed: boolean;
}

export default function MonitoringHomeScreen() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<MonitoringAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = await getToken();
      const response = await axios.get('/monitoring/assignments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Monitoring Assignments</Text>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        ) : assignments.length === 0 ? (
          <View style={styles.centerContainer}>
            <MaterialIcons name="assignment" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No assignments found</Text>
          </View>
        ) : (
          assignments.map((assignment) => (
            <TouchableOpacity
              key={assignment.id}
              style={styles.assignmentCard}
              onPress={() => router.push(`/monitoring/plots?id=${assignment.id}`)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.yearQuarter}>
                  Q{assignment.target_quarter} {assignment.target_year}
                </Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: assignment.is_completed ? '#4CAF50' : '#FF9800' }
                ]}>
                  <Text style={styles.statusText}>
                    {assignment.is_completed ? 'Completed' : 'Pending'}
                  </Text>
                </View>
              </View>
              <Text style={styles.scheduledDate}>
                Scheduled: {new Date(assignment.scheduled_date).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <MonitoringFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  assignmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  yearQuarter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  scheduledDate: {
    fontSize: 14,
    color: '#666',
  },
});
