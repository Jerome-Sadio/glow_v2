import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Star,
  ChevronRight
} from 'lucide-react-native';

import { MALE_AVATAR_BASE64, FEMALE_AVATAR_BASE64 } from '../constants/AvatarsBase64';

const { width } = Dimensions.get('window');

const ProfileView = ({ user, progress, stats }) => {
  const avatarImg = user.sexe === 'femme' 
    ? { uri: FEMALE_AVATAR_BASE64 } 
    : { uri: MALE_AVATAR_BASE64 };

  const statEntries = [
    { label: 'FORCE PHYSIQUE', value: stats.force, color: '#FF0055' },
    { label: 'INTELLIGENCE', value: stats.intelligence, color: '#00C2FF' },
    { label: 'DISCIPLINE', value: stats.discipline, color: '#9D00FF' },
    { label: 'CHARISME', value: stats.charisma, color: '#FFD700' },
    { label: 'RICHESSE', value: stats.wealth, color: '#4CAF50' },
    { label: 'SANTÉ', value: stats.health, color: '#FF4D4D' },
    { label: 'STYLE', value: stats.style, color: '#FF9F43' },
    { label: 'MENTAL', value: stats.mental, color: '#00D2D3' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarBorder}>
          <Image source={avatarImg} style={styles.avatar} />
        </View>
        <Text style={styles.userName}>{user.pseudo}</Text>
        <View style={styles.rankBadge}>
          <Text style={styles.rankLabel}>RANG {progress.rank || 'E'}</Text>
        </View>
      </View>

      {/* Stats Summary List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PARAMÈTRES DE POTENTIEL</Text>
        <View style={styles.statsList}>
          {statEntries.map((stat, i) => (
            <View key={i} style={styles.statRow}>
              <View style={styles.statInfo}>
                <View style={[styles.statDot, { backgroundColor: stat.color }]} />
                <Text style={styles.statLabelText}>{stat.label}</Text>
              </View>
              <View style={styles.statValueBox}>
                <Text style={[styles.statValueText, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statMax}>/100</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        {[
          { icon: ShieldCheck, label: 'TITRES DÉBLOQUÉS', color: '#00f2ff' },
          { icon: Star, label: 'ARCHIVES DES QUÊTES', color: '#ffa500' },
          { icon: Settings, label: 'CONFIGURATION SYSTÈME', color: '#fff' },
          { icon: LogOut, label: 'FERMER LE SYSTÈME', color: '#ff0055' }
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <item.icon size={20} color={item.color} />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <ChevronRight size={16} color="#333" />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.version}>VERSION DU SYSTÈME : 2.0.0-NATIVE</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  scrollContent: { paddingBottom: 120 },

  profileHeader: { alignItems: 'center', marginBottom: 40 },
  avatarBorder: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: '#00f2ff', padding: 5, marginBottom: 15, backgroundColor: '#000', overflow: 'hidden' },
  avatar: { width: '100%', height: '100%', borderRadius: 55 },
  userName: { color: '#fff', fontSize: 24, fontWeight: '900', fontStyle: 'italic', marginBottom: 8 },
  rankBadge: { backgroundColor: 'rgba(0,242,255,0.1)', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5, borderWidth: 1, borderColor: 'rgba(0,242,255,0.3)' },
  rankLabel: { color: '#00f2ff', fontWeight: '900', fontSize: 12, letterSpacing: 2 },

  section: { marginBottom: 30 },
  sectionTitle: { color: '#00f2ff', fontSize: 12, fontWeight: '900', letterSpacing: 3, marginBottom: 20, textAlign: 'center' },
  statsList: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 15, padding: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.02)' },
  statInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statDot: { width: 4, height: 4, borderRadius: 2 },
  statLabelText: { color: '#888', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  statValueBox: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  statValueText: { fontSize: 16, fontWeight: '900' },
  statMax: { color: '#333', fontSize: 9, fontWeight: 'bold' },

  menuContainer: { gap: 10 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: 18, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  menuLabel: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  version: { color: '#222', fontSize: 10, textAlign: 'center', marginTop: 30, fontWeight: 'bold', letterSpacing: 2 }
});

export default ProfileView;
