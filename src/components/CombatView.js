import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Activity, 
  AlertTriangle, 
  Plus, 
  History, 
  X
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const CombatView = ({ user, relapse, addAddiction }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('🔥');

  // Depression Boss (Mock logic)
  const depressionHp = 7450; 
  const depressionMaxHp = 10000;
  const depressionPercent = (depressionHp / depressionMaxHp) * 100;

  const calculateStreak = (lastRelapse) => {
    const last = new Date(lastRelapse);
    const now = new Date();
    const diffTime = Math.abs(now - last);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAdd = () => {
    if (newName.trim()) {
      addAddiction(newName, newIcon);
      setNewName('');
      setNewIcon('🔥');
      setShowAdd(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Legendary Boss Section */}
      <View style={styles.bossSection}>
        <LinearGradient 
          colors={['rgba(79,70,229,0.1)', 'transparent']} 
          style={StyleSheet.absoluteFill} 
        />
        <View style={styles.bossHeader}>
          <View>
            <Text style={styles.bossLabel}>CIBLE LÉGENDAIRE</Text>
            <Text style={styles.bossName}>TYRAN DE LA DÉPRESSION</Text>
          </View>
          <Text style={styles.bossLevel}>LVL. ???</Text>
        </View>

        <View style={styles.hpContainer}>
          <View style={styles.hpLabels}>
            <Text style={styles.hpTitle}>INTÉGRITÉ DU VIDE</Text>
            <Text style={styles.hpValue}>{Math.floor(depressionHp)} / {depressionMaxHp}</Text>
          </View>
          <View style={styles.hpBg}>
            <LinearGradient
              colors={['#4f46e5', '#3b82f6']}
              style={[styles.hpFill, { width: `${depressionPercent}%` }]}
            />
          </View>
        </View>

        <View style={styles.bossQuote}>
          <Text style={styles.quoteText}>
            "Chaque jour de pureté et de discipline inflige des dégâts à ton propre vide intérieur."
          </Text>
        </View>
      </View>

      {/* Addictions Section */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>DÉMONS INTÉRIEURS</Text>
        <TouchableOpacity 
          style={[styles.addBtn, showAdd && styles.addBtnActive]} 
          onPress={() => setShowAdd(!showAdd)}
        >
          {showAdd ? <X size={20} color="#fff" /> : <Plus size={20} color="#00f2ff" />}
        </TouchableOpacity>
      </View>

      {showAdd && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Nom de l'Addiction..."
            placeholderTextColor="#444"
            value={newName}
            onChangeText={setNewName}
          />
          <TextInput
            style={styles.input}
            placeholder="Icône (ex: 🚬, 🍔)..."
            placeholderTextColor="#444"
            value={newIcon}
            onChangeText={setNewIcon}
          />
          <TouchableOpacity style={styles.createBtn} onPress={handleAdd}>
            <Text style={styles.createBtnText}>INVOQUER LE DÉMON</Text>
          </TouchableOpacity>
        </View>
      )}

      {user.addictions.map((addiction) => {
        const streak = calculateStreak(addiction.lastRelapse);
        return (
          <View key={addiction.id} style={styles.addictionCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardLeft}>
                <View style={styles.iconBox}>
                  <Text style={styles.iconText}>{addiction.icon}</Text>
                </View>
                <View>
                  <Text style={styles.addictionName}>{addiction.name.toUpperCase()}</Text>
                  <View style={styles.statusRow}>
                    <Activity size={10} color="#00f2ff" />
                    <Text style={styles.statusText}>SÉQUENCE DE PURETÉ</Text>
                  </View>
                </View>
              </View>
              <View style={styles.streakBox}>
                <Text style={styles.streakCount}>{streak}</Text>
                <Text style={styles.streakUnit}>JOURS</Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity 
                style={styles.relapseBtn} 
                onPress={() => relapse(addiction.id)}
              >
                <AlertTriangle size={14} color="#ff0055" />
                <Text style={styles.relapseText}>RELAPS</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.historyBtn}>
                <History size={16} color="#555" />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  scrollContent: { paddingBottom: 100 },
  
  bossSection: { backgroundColor: 'rgba(79,70,229,0.05)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(79,70,229,0.2)', marginBottom: 30, overflow: 'hidden' },
  bossHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  bossLabel: { color: '#4f46e5', fontSize: 10, fontWeight: '900', letterSpacing: 3 },
  bossName: { color: '#fff', fontSize: 24, fontWeight: '900', fontStyle: 'italic' },
  bossLevel: { color: '#4f46e5', fontSize: 10, fontWeight: 'bold' },
  
  hpContainer: { marginBottom: 20 },
  hpLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  hpTitle: { color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  hpValue: { color: '#4f46e5', fontSize: 12, fontWeight: 'bold' },
  hpBg: { height: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  hpFill: { height: '100%', borderRadius: 4 },
  
  bossQuote: { backgroundColor: 'rgba(79,70,229,0.05)', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(79,70,229,0.1)' },
  quoteText: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontStyle: 'italic', textAlign: 'center', lineHeight: 18 },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 5 },
  sectionTitle: { color: '#00f2ff', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,242,255,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(0,242,255,0.2)' },
  addBtnActive: { backgroundColor: 'rgba(255,0,85,0.2)', borderColor: '#ff0055' },

  addForm: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 15, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  input: { backgroundColor: '#000', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#222' },
  createBtn: { backgroundColor: '#00f2ff', padding: 15, borderRadius: 10, alignItems: 'center' },
  createBtnText: { color: '#000', fontWeight: '900', fontSize: 14 },

  addictionCard: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 15, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBox: { width: 50, height: 50, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  iconText: { fontSize: 24 },
  addictionName: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  statusText: { color: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  
  streakBox: { alignItems: 'flex-end' },
  streakCount: { color: '#00f2ff', fontSize: 24, fontWeight: '900' },
  streakUnit: { color: 'rgba(0,242,255,0.3)', fontSize: 9, fontWeight: '900' },

  cardActions: { flexDirection: 'row', gap: 10, marginTop: 15 },
  relapseBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, backgroundColor: 'rgba(255,0,85,0.05)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,0,85,0.2)' },
  relapseText: { color: '#ff0055', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  historyBtn: { width: 50, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }
});

export default CombatView;
