import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TextInput,
  Animated
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
  Zap
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

const QuestView = ({ tasks, addTask, completeTask, deleteTask }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedCat, setSelectedCat] = useState('discipline');

  const handleCreate = () => {
    if (!newTaskText.trim()) return;
    addTask(newTaskText, selectedCat, selectedCat, 30);
    setNewTaskText('');
    setShowAdd(false);
  };

  const renderTask = ({ item }) => {
    const cat = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[0];
    
    return (
      <View style={[styles.taskItem, item.completed && styles.taskCompleted]}>
        <View style={styles.taskLeft}>
          <TouchableOpacity 
            onPress={() => completeTask(item.id)}
            disabled={item.completed}
            style={styles.checkBtn}
          >
            {item.completed ? 
              <CheckCircle2 size={24} color="#00f2ff" /> : 
              <Circle size={24} color="#333" />
            }
          </TouchableOpacity>
          
          <View style={styles.taskInfo}>
            <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>{item.text}</Text>
            <View style={styles.taskMeta}>
              <View style={styles.xpBadge}>
                <Award size={10} color="#00f2ff" />
                <Text style={styles.xpText}>+{item.xp} XP</Text>
              </View>
              <Text style={styles.catLabel}>{cat.label}</Text>
            </View>
          </View>
        </View>

        {!item.completed && (
          <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteBtn}>
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

          <TouchableOpacity 
            style={[styles.createBtn, !newTaskText.trim() && { opacity: 0.3 }]}
            onPress={handleCreate}
            disabled={!newTaskText.trim()}
          >
            <Text style={styles.createBtnText}>ACCEPTER LA QUÊTE</Text>
          </TouchableOpacity>
        </View>
      )}

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
  catLabel: { color: '#555', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },
  
  deleteBtn: { padding: 10 },
  empty: { paddingVertical: 60, alignItems: 'center' },
  emptyText: { color: '#333', textAlign: 'center', fontStyle: 'italic', lineHeight: 20 }
});

export default QuestView;
