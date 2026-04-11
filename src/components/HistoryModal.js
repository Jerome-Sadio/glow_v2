import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  FlatList, 
  Dimensions 
} from 'react-native';
import { 
  X, 
  CheckCircle2, 
  Clock,
  Award
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

const HistoryModal = ({ visible, onClose, history }) => {
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const renderItem = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <CheckCircle2 size={18} color="#00f2ff" />
        <Text style={styles.questText}>{item.text}</Text>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <Clock size={12} color="#444" />
          <Text style={styles.footerText}>{formatDate(item.completedAt)}</Text>
        </View>
        <View style={styles.footerItem}>
          <Award size={12} color="#ffa500" />
          <Text style={styles.xpText}>+{item.xp} XP</Text>
        </View>
        <Text style={styles.catText}>{item.category.toUpperCase()}</Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <LinearGradient 
          colors={['#0a0a0a', '#000']} 
          style={styles.modalContent}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.headerSubtitle}>MÉMOIRE DU SYSTÈME</Text>
              <Text style={styles.headerTitle}>ARCHIVES DES QUÊTES</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Aucune archive disponible.{"\n"}Complétez des quêtes pour écrire votre légende.</Text>
              </View>
            }
          />
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'flex-end' },
  modalContent: { height: height * 0.85, borderTopLeftRadius: 30, borderTopRightRadius: 30, borderWidth: 1, borderColor: 'rgba(255,165,0,0.1)', padding: 25 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  headerSubtitle: { color: '#ffa500', fontSize: 10, fontWeight: '900', letterSpacing: 3 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '900', fontStyle: 'italic' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },

  list: { paddingBottom: 50 },
  historyCard: { backgroundColor: 'rgba(255,255,255,0.02)', padding: 18, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  questText: { color: '#fff', fontSize: 14, fontWeight: 'bold', flex: 1 },
  
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  footerText: { color: '#444', fontSize: 10, fontWeight: 'bold' },
  xpText: { color: '#ffa500', fontSize: 10, fontWeight: '900' },
  catText: { color: 'rgba(255,255,255,0.1)', fontSize: 10, fontWeight: '900', marginLeft: 'auto' },

  emptyContainer: { flex: 1, paddingVertical: 100, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#222', textAlign: 'center', fontStyle: 'italic', lineHeight: 22 }
});

export default HistoryModal;
