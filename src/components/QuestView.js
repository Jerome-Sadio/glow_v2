import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TextInput,
  Animated,
  Alert
} from 'react-native';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Award, 
  X,
  Dumbbell,
  Brain,
  Scroll,
  Sparkles,
  Coins,
  Heart,
  Palette,
  Zap,
  Clock,
  CalendarDays
} from 'lucide-react-native';

const CATEGORIES = [
  { id: 'force', label: 'Force', icon: Dumbbell, color: '#FF0055' },
  { id: 'intelligence', label: 'Intel', icon: Brain, color: '#00C2FF' },
  { id: 'discipline', label: 'Disc', icon: Scroll, color: '#9D00FF' },
  { id: 'charisma', label: 'Char', icon: Sparkles, color: '#FFD700' },
  { id: 'wealth', label: 'Rich.', icon: Coins, color: '#4CAF50' },
  { id: 'health', label: 'Santé', icon: Heart, color: '#FF4D4D' },
  { id: 'style', label: 'Style', icon: Palette, color: '#FF9F43' },
  { id: 'mental', label: 'Mental', icon: Zap, color: '#00D2D3' },
];

const PRIORITIES = [
  { id: 'urgent-important', label: 'Urgent & Important', color: '#ff0055' },
  { id: 'important', label: 'Important, Non-Urgent', color: '#ffa500' },
  { id: 'urgent', label: 'Urgent, Non-Important', color: '#4f46e5' },
  { id: 'normal', label: 'Non-Urgent, Non-Important', color: '#4caf50' },
];

const DAYS = [
  { id: 1, label: 'L' },
  { id: 2, label: 'M' },
  { id: 3, label: 'M' },
  { id: 4, label: 'J' },
  { id: 5, label: 'V' },
  { id: 6, label: 'S' },
  { id: 0, label: 'D' },
];

const QuestView = ({ tasks, addTask, completeTask, deleteTask }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedCat, setSelectedCat] = useState('discipline');
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('30');
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5, 6, 0]);
  const [priority, setPriority] = useState('normal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleDay = (dayId) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(prev => prev.filter(d => d !== dayId));
    } else {
      setSelectedDays(prev => [...prev, dayId]);
    }
  };

  const handleCreate = async () => {
    if (!newTaskText.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const time = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
      await addTask(newTaskText, selectedCat, selectedCat, 30, time, selectedDays, priority);
      setNewTaskText('');
      setShowAdd(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTask = ({ item }) => {
    const cat = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[0];
    const prioRecord = PRIORITIES.find(p => p.id === item.priority) || PRIORITIES[3];
    
    // Check if recurring task is done for today
    const isDoneToday = item.lastCompletedAt && 
      new Date(item.lastCompletedAt).toDateString() === new Date().toDateString();
    
    const isActuallyCompleted = item.completed || isDoneToday;
    
    return (
      <View style={[
        styles.taskItem, 
        isActuallyCompleted && styles.taskCompleted, 
        { 
          borderLeftColor: prioRecord.color, 
          borderLeftWidth: 4,
          backgroundColor: isActuallyCompleted ? 'rgba(255,255,255,0.02)' : `${prioRecord.color}10`
        }
      ]}>
        <View style={styles.taskLeft}>
          <TouchableOpacity 
            onPress={() => completeTask(item.id)}
            disabled={isActuallyCompleted}
            style={styles.checkBtn}
          >
            {isActuallyCompleted ? 
              <CheckCircle2 size={24} color={isDoneToday ? "#00f2ff" : "#ccc"} /> : 
              <Circle size={24} color="#333" />
            }
          </TouchableOpacity>
          
          <View style={styles.taskInfo}>
            <Text style={[styles.taskText, isActuallyCompleted && styles.taskTextCompleted]}>{item.text}</Text>
            <View style={styles.taskMeta}>
              <View style={styles.xpBadge}>
                <Award size={10} color="#00f2ff" />
                <Text style={styles.xpText}>+{item.xp} XP</Text>
              </View>
              <View style={[styles.catBadge, { backgroundColor: `${cat.color}15`, borderColor: `${cat.color}40` }]}>
                <cat.icon size={10} color={cat.color} />
                <Text style={[styles.catLabel, { color: cat.color }]}>{cat.label}</Text>
              </View>
            </View>

            {(item.time || item.days) && (
              <View style={styles.scheduleRow}>
                <Clock size={10} color="#444" />
                <Text style={styles.scheduleText}>{item.time || "--:--"}</Text>
                <View style={styles.dot} />
                <Text style={styles.scheduleText}>{item.days?.length === 7 ? "Quotidien" : item.days?.map(d => DAYS.find(day => day.id === d)?.label).join(' ')}</Text>
              </View>
            )}
          </View>
        </View>

        {!isActuallyCompleted && (
          <TouchableOpacity 
            onPress={() => {
              Alert.alert(
                "ABANDON DE QUÊTE",
                "Voulez-vous vraiment éliminer cette quête ? Cette action est définitive.",
                [
                  { text: "MAINTENIR", style: "cancel" },
                  { text: "ÉLIMINER", onPress: () => deleteTask(item.id), style: "destructive" }
                ]
              );
            }} 
            style={styles.deleteBtn}
          >
            <Trash2 size={18} color="#555" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>QUÊTES JOURNALIÈRES</Text>
        <TouchableOpacity 
          style={[styles.addToggle, showAdd && styles.addToggleActive]} 
          onPress={() => setShowAdd(!showAdd)}
        >
          {showAdd ? <X size={24} color="#fff" /> : <Plus size={24} color="#00f2ff" />}
        </TouchableOpacity>
      </View>

      {showAdd && (
        <View style={styles.addCard}>
          <TextInput
            style={styles.input}
            placeholder="Ex: 50 Pompes, Lire 30min..."
            placeholderTextColor="#444"
            value={newTaskText}
            onChangeText={setNewTaskText}
            autoFocus
          />
          
          <View style={styles.catGrid}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCat(cat.id)}
                style={[styles.catItem, selectedCat === cat.id && { borderColor: cat.color, backgroundColor: 'rgba(255,255,255,0.05)' }]}
              >
                <cat.icon size={16} color={selectedCat === cat.id ? cat.color : '#555'} />
                <Text style={[styles.catBtnText, selectedCat === cat.id && { color: cat.color }]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.formRow}>
            <View style={styles.timeSection}>
              <Text style={styles.subLabel}>HEURE</Text>
              <View style={styles.timeInputs}>
                <TextInput 
                  style={styles.timeInput} 
                  value={hour} 
                  onChangeText={v => setHour(v.slice(0, 2))}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={styles.timeDivider}>:</Text>
                <TextInput 
                  style={styles.timeInput} 
                  value={minute} 
                  onChangeText={v => setMinute(v.slice(0, 2))}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
            </View>

            <View style={styles.prioSection}>
              <Text style={styles.subLabel}>PRIORITÉ</Text>
              <View style={styles.prioGrid}>
                {PRIORITIES.map(p => (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => setPriority(p.id)}
                    style={[styles.prioBtn, { backgroundColor: p.color, opacity: priority === p.id ? 1 : 0.2 }]}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.daysSection}>
            <Text style={styles.subLabel}>JOURS RECURRENT</Text>
            <View style={styles.daysGrid}>
              {DAYS.map(day => (
                <TouchableOpacity
                  key={day.id}
                  onPress={() => toggleDay(day.id)}
                  style={[styles.dayCircle, selectedDays.includes(day.id) && styles.dayCircleActive]}
                >
                  <Text style={[styles.dayLabel, selectedDays.includes(day.id) && styles.dayLabelActive]}>{day.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.createBtn, (!newTaskText.trim() || isSubmitting) && { opacity: 0.3 }]}
            onPress={handleCreate}
            disabled={!newTaskText.trim() || isSubmitting}
          >
            <Text style={styles.createBtnText}>
              {isSubmitting ? "SYNCHRONISATION..." : "ACCEPTER LA QUÊTE"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Legend */}
      <View style={styles.legend}>
        {PRIORITIES.map(p => (
          <View key={p.id} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: p.color }]} />
            <Text style={styles.legendText}>{p.label.split(',')[0]}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Le système attend vos ordres.{"\n"}Créez une nouvelle quête.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  title: { color: '#00f2ff', fontSize: 18, fontWeight: '900', fontStyle: 'italic', letterSpacing: 2 },
  addToggle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,242,255,0.1)', borderWith: 1, borderColor: 'rgba(0,242,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  addToggleActive: { backgroundColor: 'rgba(255,0,85,0.3)', borderColor: '#ff0055' },
  
  addCard: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 20 },
  input: { backgroundColor: '#000', color: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#222', marginBottom: 15 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
  catItem: { width: '23%', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#222', alignItems: 'center', gap: 4 },
  catBtnText: { fontSize: 8, fontWeight: 'bold', color: '#555' },
  createBtn: { backgroundColor: '#00f2ff', padding: 15, borderRadius: 8, alignItems: 'center' },
  createBtnText: { color: '#000', fontWeight: '900', fontSize: 14 },

  list: { paddingBottom: 100 },
  taskItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 10 },
  taskCompleted: { opacity: 0.3 },
  taskLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 15 },
  taskInfo: { flex: 1 },
  taskText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  taskTextCompleted: { textDecorationLine: 'line-through', color: '#888' },
  taskMeta: { flexDirection: 'row', gap: 10, marginTop: 5 },
  xpBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,242,255,0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  xpText: { color: '#00f2ff', fontSize: 9, fontWeight: '900' },
  catBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
  catLabel: { fontSize: 8, fontWeight: '900', textTransform: 'uppercase' },
  
  deleteBtn: { padding: 10 },
  empty: { paddingVertical: 60, alignItems: 'center' },
  emptyText: { color: '#333', textAlign: 'center', fontStyle: 'italic', lineHeight: 20 },

  // New Form Styles
  formRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, gap: 15 },
  subLabel: { fontSize: 8, color: '#444', fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  timeSection: { flex: 1 },
  timeInputs: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#000', borderRadius: 8, padding: 5, borderWidth: 1, borderColor: '#222' },
  timeInput: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center', width: 40 },
  timeDivider: { color: '#444', fontSize: 16, marginHorizontal: 2 },
  
  prioSection: { flex: 1.5 },
  prioGrid: { flexDirection: 'row', gap: 5 },
  prioBtn: { flex: 1, height: 35, borderRadius: 6 },

  daysSection: { marginBottom: 20 },
  daysGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCircle: { width: 35, height: 35, borderRadius: 18, borderWidth: 1, borderColor: '#222', alignItems: 'center', justifyContent: 'center' },
  dayCircleActive: { borderColor: '#00f2ff', backgroundColor: 'rgba(0,242,255,0.05)' },
  dayLabel: { color: '#333', fontSize: 10, fontWeight: '900' },
  dayLabelActive: { color: '#00f2ff' },

  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginBottom: 20, paddingHorizontal: 5 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legendText: { color: '#444', fontSize: 8, fontWeight: 'bold' },

  scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  scheduleText: { color: '#444', fontSize: 9, fontWeight: 'bold' },
  dot: { width: 2, height: 2, borderRadius: 1, backgroundColor: '#444' }
});

export default QuestView;
