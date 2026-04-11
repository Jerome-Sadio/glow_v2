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
  Zap, 
  Eye, 
  Shield, 
  Sword, 
  Crown, 
  Skull, 
  Flame, 
  Scroll, 
  Sparkles,
  Lock
} from 'lucide-react-native';
import { TITLES } from '../data/titles';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ICON_MAP = {
  Zap, Eye, Shield, Sword, Crown, Skull, Flame, Scroll, Sparkles
};

const TitlesModal = ({ visible, onClose, unlockedTitles }) => {
  const renderItem = ({ item }) => {
    const isUnlocked = unlockedTitles.includes(item.id);
    const IconComponent = ICON_MAP[item.icon] || Zap;

    return (
      <View style={[styles.titleCard, !isUnlocked && styles.lockedCard]}>
        <View style={[styles.iconContainer, { borderColor: isUnlocked ? '#00f2ff' : '#222' }]}>
          {isUnlocked ? (
            <IconComponent size={24} color="#00f2ff" />
          ) : (
            <Lock size={20} color="#333" />
          )}
        </View>
        <View style={styles.titleInfo}>
          <Text style={[styles.titleName, !isUnlocked && styles.lockedText]}>
            {isUnlocked ? item.name : '??????'}
          </Text>
          <Text style={styles.titleDesc}>
            {isUnlocked ? item.description : 'Condition de déblocage inconnue'}
          </Text>
        </View>
        {isUnlocked && (
          <View style={styles.unlockedBadge}>
            <Text style={styles.unlockedBadgeText}>DÉBLOQUÉ</Text>
          </View>
        )}
      </View>
    );
  };

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
              <Text style={styles.headerSubtitle}>ARCHIVES DU SYSTÈME</Text>
              <Text style={styles.headerTitle}>TITRES ACQUIS</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={TITLES}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'flex-end' },
  modalContent: { height: height * 0.85, borderTopLeftRadius: 30, borderTopRightRadius: 30, borderWidth: 1, borderColor: 'rgba(0,242,255,0.1)', padding: 25 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  headerSubtitle: { color: '#00f2ff', fontSize: 10, fontWeight: '900', letterSpacing: 3 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '900', fontStyle: 'italic' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },

  list: { paddingBottom: 50 },
  titleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', padding: 15, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  lockedCard: { opacity: 0.6 },
  
  iconContainer: { width: 50, height: 50, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)', marginRight: 15 },
  titleInfo: { flex: 1 },
  titleName: { color: '#fff', fontSize: 16, fontWeight: '900', marginBottom: 4 },
  lockedText: { color: '#444' },
  titleDesc: { color: '#666', fontSize: 11, fontWeight: 'bold' },
  
  unlockedBadge: { backgroundColor: 'rgba(0,242,255,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(0,242,255,0.2)' },
  unlockedBadgeText: { color: '#00f2ff', fontSize: 8, fontWeight: '900' }
});

export default TitlesModal;
