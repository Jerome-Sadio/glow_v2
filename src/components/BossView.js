import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ShieldAlert, 
  Zap, 
  Sword, 
  Trophy 
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const BossView = ({ boss, nextBoss }) => {
  const hpPercent = (boss.hp / boss.maxHp) * 100;
  const isDead = boss.hp <= 0;

  return (
    <View style={styles.container}>
      {/* Boss Header */}
      <View style={styles.header}>
        <View style={styles.alertLine}>
          <ShieldAlert size={14} color="#ff0055" />
          <Text style={styles.alertText}>BOSS ÉLITE DÉTECTÉ</Text>
        </View>
        <Text style={styles.bossName}>{boss.name}</Text>
        <View style={styles.separator} />
      </View>

      {/* Boss Visual Core */}
      <View style={styles.vortexContainer}>
        <View style={[styles.glow, { backgroundColor: isDead ? '#00f2ff' : '#ff0055' }]} />
        <View style={styles.bossAvatar}>
          <Text style={styles.bossEmoji}>{isDead ? '💀' : boss.image}</Text>
        </View>

        {/* HP Bar */}
        <View style={styles.hpContainer}>
          <View style={styles.hpLabels}>
            <Text style={styles.hpTitle}>VITALITÉ DU BOSS</Text>
            <Text style={styles.hpValue}>{Math.ceil(boss.hp)} / {boss.maxHp} HP</Text>
          </View>
          <View style={styles.hpBg}>
            <LinearGradient
              colors={['#ff0055', '#7a0029']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.hpFill, { width: `${hpPercent}%` }]}
            />
          </View>
        </View>
      </View>

      {/* Boss Info Card */}
      <View style={styles.infoCard}>
        <LinearGradient 
          colors={['rgba(255,0,85,0.05)', 'transparent']} 
          style={StyleSheet.absoluteFill} 
        />
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Zap size={20} color="#00C2FF" />
            <Text style={styles.statLabel}>RÉCOMPENSE</Text>
            <Text style={styles.statValue}>+{boss.rewardXp} XP</Text>
          </View>
          <View style={styles.statBox}>
            <Sword size={20} color="#ff0055" />
            <Text style={styles.statLabel}>DÉGÂTS</Text>
            <Text style={styles.statValue}>Quêtes</Text>
          </View>
        </View>
        <View style={styles.quoteWrapper}>
          <Text style={styles.quoteText}>"{boss.quote}"</Text>
        </View>
      </View>

      {/* Victory Modal */}
      <Modal visible={isDead} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient colors={['rgba(0,0,0,0.95)', '#000']} style={StyleSheet.absoluteFill} />
          
          <View style={styles.modalContent}>
            <View style={styles.trophyGlow}>
              <Trophy size={80} color="#00f2ff" />
            </View>
            
            <Text style={styles.victoryTitle}>VICTOIRE !</Text>
            <Text style={styles.victorySubtitle}>CIBLE NEUTRALISÉE</Text>
            
            <View style={styles.victoryCard}>
              <Text style={styles.victoryText}>
                "{boss.name} n'est plus un obstacle. Ta force continue de croître."
              </Text>
            </View>

            <TouchableOpacity style={styles.nextBtn} onPress={nextBoss}>
              <Text style={styles.nextBtnText}>CIBLE SUIVANTE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 50 },
  alertLine: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,0,85,0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,0,85,0.2)', marginBottom: 15 },
  alertText: { color: '#ff0055', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  bossName: { color: '#fff', fontSize: 32, fontWeight: '900', textAlign: 'center', fontStyle: 'italic', textTransform: 'uppercase' },
  separator: { width: 100, height: 2, backgroundColor: '#ff0055', marginTop: 10, borderRadius: 1 },

  vortexContainer: { width: width * 0.7, height: width * 0.7, alignItems: 'center', justifyContent: 'center', marginVertical: 40 },
  glow: { ...StyleSheet.absoluteFillObject, borderRadius: 1000, opacity: 0.1, transform: [{ scale: 1.2 }] },
  bossAvatar: { width: '80%', height: '80%', alignItems: 'center', justifyContent: 'center' },
  bossEmoji: { fontSize: 120, textShadowColor: 'rgba(255,0,85,0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 30 },

  hpContainer: { width: width * 0.85, marginTop: 40 },
  hpLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  hpTitle: { color: '#ff0055', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  hpValue: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  hpBg: { height: 12, backgroundColor: '#000', borderRadius: 6, borderWidth: 1, borderColor: '#333', overflow: 'hidden', padding: 2 },
  hpFill: { height: '100%', borderRadius: 4 },

  infoCard: { width: width * 0.85, marginTop: 40, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 15, padding: 20, borderWidth: 1, borderColor: 'rgba(255,0,85,0.1)', overflow: 'hidden' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  statBox: { alignItems: 'center', gap: 5 },
  statLabel: { color: '#555', fontSize: 9, fontWeight: 'bold' },
  statValue: { color: '#fff', fontSize: 14, fontWeight: '900' },
  quoteWrapper: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 15 },
  quoteText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontStyle: 'italic', textAlign: 'center' },

  modalOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  modalContent: { width: '90%', alignItems: 'center' },
  trophyGlow: { marginBottom: 30, shadowColor: '#00f2ff', shadowRadius: 30, shadowOpacity: 0.8 },
  victoryTitle: { color: '#fff', fontSize: 48, fontWeight: '900', fontStyle: 'italic' },
  victorySubtitle: { color: '#00f2ff', fontSize: 16, fontWeight: '900', letterSpacing: 4, marginBottom: 30 },
  victoryCard: { padding: 20, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(0,242,255,0.1)', marginBottom: 40 },
  victoryText: { color: '#888', fontStyle: 'italic', textAlign: 'center' },
  nextBtn: { backgroundColor: '#00f2ff', paddingVertical: 18, width: '100%', borderRadius: 10, alignItems: 'center' },
  nextBtnText: { color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 2 }
});

export default BossView;
