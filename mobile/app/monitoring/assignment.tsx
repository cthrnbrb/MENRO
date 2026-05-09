import { View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import MonitoringNavFooter from "@/src/components/MonitoringNavFooter";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "@/src/api/axios";
import { getToken } from "@/src/services/auth-storage";

interface Assignment {
  id: string;
  title: string;
  location: string;
  barangay: string;
  city: string;
  status: 'in_progress' | 'pending' | 'completed' | 'scheduled';
  trees_to_monitor: number;
  due_date: string;
  assigned_by: string;
  date_assigned: string;
  priority: 'normal' | 'high' | 'low';
  trees_monitored: number;
  description: string;
}

const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Sitio Pag-asa Reforestation",
    location: "Brgy. Pag-asa",
    barangay: "Pag-asa",
    city: "Antipolo City",
    status: 'in_progress',
    trees_to_monitor: 25,
    due_date: "2024-05-22",
    assigned_by: "MENRO Team",
    date_assigned: "2024-05-20",
    priority: 'normal',
    trees_monitored: 10,
    description: "Monitor the survival and condition of planted trees in the Sitio Pag-asa reforestation area."
  },
  {
    id: "2",
    title: "Brgy. San Isidro Tree Planting",
    location: "Brgy. San Isidro",
    barangay: "San Isidro",
    city: "Antipolo City",
    status: 'pending',
    trees_to_monitor: 40,
    due_date: "2024-05-23",
    assigned_by: "MENRO Team",
    date_assigned: "2024-05-18",
    priority: 'normal',
    trees_monitored: 0,
    description: "Initial tree planting and monitoring in Barangay San Isidro area."
  },
  {
    id: "3",
    title: "Maligaya Greening Project",
    location: "Brgy. Maligaya",
    barangay: "Maligaya",
    city: "Antipolo City",
    status: 'pending',
    trees_to_monitor: 30,
    due_date: "2024-05-24",
    assigned_by: "MENRO Team",
    date_assigned: "2024-05-19",
    priority: 'high',
    trees_monitored: 5,
    description: "Greening project for Maligaya community area."
  },
  {
    id: "4",
    title: "Sitio Tuburan Forest Patch",
    location: "Brgy. Tuburan",
    barangay: "Tuburan",
    city: "Antipolo City",
    status: 'scheduled',
    trees_to_monitor: 50,
    due_date: "2024-05-28",
    assigned_by: "MENRO Team",
    date_assigned: "2024-05-15",
    priority: 'normal',
    trees_monitored: 0,
    description: "Forest patch monitoring in Sitio Tuburan."
  },
  {
    id: "5",
    title: "Riverside Greenbelt Project",
    location: "Brgy. Dela Paz",
    barangay: "Dela Paz",
    city: "Antipolo City",
    status: 'scheduled',
    trees_to_monitor: 35,
    due_date: "2024-05-30",
    assigned_by: "MENRO Team",
    date_assigned: "2024-05-16",
    priority: 'low',
    trees_monitored: 0,
    description: "Greenbelt development along riverside area."
  }
];

export default function AssignmentScreen() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setAssignments(mockAssignments);
      setLoading(false);
    }, 600);
  }, []);

  const stats = {
    total: assignments.length,
    pending: assignments.filter((a: Assignment) => a.status === 'pending').length,
    inProgress: assignments.filter((a: Assignment) => a.status === 'in_progress').length,
    completed: assignments.filter((a: Assignment) => a.status === 'completed').length,
  };

  const todayDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const todayAssignments = assignments.filter((a: Assignment) => {
    const due = new Date(a.due_date);
    const today = new Date();
    return due.toDateString() === today.toDateString() || a.status === 'in_progress' || a.status === 'pending';
  }).slice(0, 3);

  const upcomingAssignments = assignments.filter((a: Assignment) => a.status === 'scheduled');

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'in_progress': return { label: 'In Progress', bg: '#dcfce7', text: '#166534', dot: '#10b981' };
      case 'pending': return { label: 'Pending', bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' };
      case 'completed': return { label: 'Completed', bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' };
      case 'scheduled': return { label: 'Scheduled', bg: '#f3f4f6', text: '#374151', dot: '#6b7280' };
      default: return { label: status, bg: '#f3f4f6', text: '#374151', dot: '#6b7280' };
    }
  };

  const getIconColors = (index: number) => {
    const colors = [
      { bg: '#dcfce7', icon: '#10b981' },
      { bg: '#fef3c7', icon: '#f59e0b' },
      { bg: '#dbeafe', icon: '#3b82f6' },
      { bg: '#fce7f3', icon: '#ec4899' },
      { bg: '#f3e8ff', icon: '#a855f7' },
    ];
    return colors[index % colors.length];
  };

  const renderAssignmentCard = (assignment: Assignment, index: number, showChevron = true) => {
    const status = getStatusConfig(assignment.status);
    const colors = getIconColors(index);
    const isSelected = selectedId === assignment.id;
    const progress = Math.round((assignment.trees_monitored / assignment.trees_to_monitor) * 100);

    return (
      <TouchableOpacity
        key={assignment.id}
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => setSelectedId(isSelected ? null : assignment.id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardRow}>
          <View style={[styles.iconCircle, { backgroundColor: colors.bg }]}>
            <MaterialIcons name="location-on" size={20} color={colors.icon} />
          </View>
          <View style={styles.cardContent}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{assignment.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                <View style={[styles.statusDot, { backgroundColor: status.dot }]} />
                <Text style={[styles.statusText, { color: status.text }]}>{status.label}</Text>
              </View>
            </View>
            <Text style={styles.cardLocation}>{assignment.location}, {assignment.city}</Text>
            <View style={styles.cardMeta}>
              <View style={styles.metaBox}>
                <Text style={styles.metaLabel}>Trees to monitor</Text>
                <Text style={styles.metaValue}>{assignment.trees_to_monitor}</Text>
              </View>
              <View style={styles.metaBox}>
                <Text style={styles.metaLabel}>Due date</Text>
                <Text style={styles.metaValue}>{new Date(assignment.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
              </View>
            </View>
          </View>
          {showChevron && (
            <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
          )}
        </View>

        {isSelected && (
          <View style={styles.detailSection}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <MaterialIcons name="person" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Assigned by</Text>
                <Text style={styles.detailValue}>{assignment.assigned_by}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <MaterialIcons name="calendar-today" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Date assigned</Text>
                <Text style={styles.detailValue}>{new Date(assignment.date_assigned).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialIcons name="event" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Due date</Text>
                <Text style={styles.detailValue}>{new Date(assignment.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <MaterialIcons name="flag" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Priority</Text>
                <View style={styles.priorityWrap}>
                  <View style={[styles.pDot, { backgroundColor: assignment.priority === 'high' ? '#ef4444' : assignment.priority === 'normal' ? '#10b981' : '#6b7280' }]} />
                  <Text style={styles.detailValue}>{assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailItemFull}>
                <MaterialIcons name="park" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Trees to monitor</Text>
                <Text style={styles.detailValue}>{assignment.trees_to_monitor}</Text>
              </View>
              <View style={styles.detailItemFull}>
                <Text style={styles.detailLabel}>Trees monitored</Text>
                <View style={styles.progressWrap}>
                  <Text style={styles.progressText}>{assignment.trees_monitored} ({progress}%)</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <MaterialIcons name="info" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.detailDesc}>{assignment.description}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.startBtn} onPress={() => router.push('/monitoring/add')}>
              <MaterialIcons name="play-arrow" size={18} color="#fff" />
              <Text style={styles.startBtnText}>Start Monitoring</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Hello, Juan Dela Cruz <Text style={styles.leaf}>🌿</Text></Text>
          <Text style={styles.greetingSub}>Here are the tree monitoring tasks assigned to you.</Text>
        </View> */}

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#1f2937' }]}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total{'\n'}Assignments</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#f59e0b' }]}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#3b82f6' }]}>{stats.inProgress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#10b981' }]}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Assignments</Text>
              <View style={styles.dateBadge}>
                <MaterialIcons name="calendar-today" size={14} color="#6b7280" />
                <Text style={styles.dateText}>{todayDate}</Text>
              </View>
            </View>
            {todayAssignments.map((a: Assignment, i: number) => renderAssignmentCard(a, i))}

            {upcomingAssignments.length > 0 && (
              <>
                <View style={[styles.sectionHeader, { marginTop: 8 }]}>
                  <Text style={styles.sectionTitle}>Upcoming Assignments</Text>
                </View>
                {upcomingAssignments.map((a: Assignment, i: number) => renderAssignmentCard(a, i + 3))}
              </>
            )}
          </>
        )}
      </ScrollView>

      <MonitoringNavFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  greetingSection: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  leaf: {
    fontSize: 20,
  },
  greetingSub: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
  },
  loader: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardSelected: {
    borderColor: '#10b981',
    borderWidth: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  cardLocation: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaBox: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 16,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  detailItemFull: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 'auto',
  },
  detailDesc: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
    lineHeight: 18,
    flexBasis: '100%',
    marginLeft: 24,
  },
  priorityWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 'auto',
  },
  pDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressWrap: {
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  progressBar: {
    width: 80,
    height: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    marginTop: 8,
  },
  startBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
