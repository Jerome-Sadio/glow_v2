import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  TextInput,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Home, 
  ListTodo, 
  Swords, 
  LayoutDashboard, 
  User as UserIcon,
  Flame
} from 'lucide-react-native';

// Hooks & Logic
import { useGameState } from './src/hooks/useGameState';

// Components
import StatWheel from './src/components/StatWheel';
import QuestView from './src/components/QuestView';
import BossView from './src/components/BossView';
import CombatView from './src/components/CombatView';
import ProfileView from './src/components/ProfileView';
import { SystemHUD } from './src/components/SystemHUD';

const App = () => {
  const { 
    user, 
    stats, 
    progress, 
    tasks, 
    boss, 
    depressionHp,
    streak, 
    loading, 
    completeTask, 
    addTask,
    deleteTask,
    nextBoss, 
    getRandomQuote, 
    completeOnboarding,
    relapse,
    addAddiction,
    history,
    unlockedTitles,
    updateProfile,
    resetGameState
  } = useGameState();

  const [activeTab, setActiveTab] = useState('home');
  const [currentQuote, setCurrentQuote] = useState('');
  
  // Onboarding States
  const [pseudo, setPseudo] = useState('');
  const [sexe, setSexe] = useState('homme'); 

  useEffect(() => {
    setCurrentQuote(getRandomQuote());
  }, []);

  if (loading) return null;

  // --- ECRAN ONBOARDING ---
  if (!user.onboardingComplete) {
    return (
      <SafeAreaView style={styles.onboardingContainer}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={['#0a0a0a', '#05101a']} style={StyleSheet.absoluteFill} />
        
        <View style={styles.onboardingContent}>
          <Text style={styles.hunterTitle}>ÉVEIL DU SYSTÈME</Text>
          <Text style={styles.hunterSubtitle}>INITIALISATION DU PROFIL CHASSEUR</Text>
          
          <View style={styles.inputCard}>
            <Text style={styles.label}>PSEUDO DU CHASSEUR</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Sung Jin-Woo"
              placeholderTextColor="#333"
              value={pseudo}
              onChangeText={setPseudo}
            />
          </View>

          <View style={styles.sexSelection}>
            <TouchableOpacity 
              style={[styles.sexBtn, sexe === 'homme' && styles.sexBtnActive]}
              onPress={() => setSexe('homme')}
            >
              <Text style={[styles.sexBtnText, sexe === 'homme' && styles.sexBtnTextActive]}>HOMME</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sexBtn, sexe === 'femme' && styles.sexBtnActive]}
              onPress={() => setSexe('femme')}
            >
              <Text style={[styles.sexBtnText, sexe === 'femme' && styles.sexBtnTextActive]}>FEMME</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.startBtn}
            onPress={() => pseudo.trim() && completeOnboarding(pseudo, sexe)}
          >
            <Text style={styles.startBtnText}>ENTRER DANS LE SYSTÈME</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- RENDER CONTENT BY TAB ---
  const renderContent = () => {
    let content;
    let title = "[ SYSTEM HUD ]";

    switch (activeTab) {
      case 'home':
        title = "INTERFACE CHASSEUR";
        content = (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <View>
                <Text style={styles.rankText}>RANG {progress.rank || 'E'}</Text>
                <Text style={styles.userName}>{user.pseudo}</Text>
              </View>
              <View style={styles.streakBadge}>
                <Flame size={16} color="#ffa500" />
                <Text style={styles.streakText}>{streak} JOURS</Text>
              </View>
            </View>

            <View style={styles.wheelSection}>
              <StatWheel stats={stats} userSexe={user.sexe} />
            </View>

            <View style={styles.quoteBox}>
              <LinearGradient colors={['rgba(0,242,255,0.05)', 'transparent']} style={StyleSheet.absoluteFill} />
              <Text style={styles.quoteText}>"{currentQuote}"</Text>
              <View style={styles.scanLine} />
            </View>

            <View style={styles.expSection}>
              <View style={styles.expHeader}>
                <Text style={styles.levelText}>LVL. {progress.level}</Text>
                <Text style={styles.expValue}>{progress.xp} / {progress.xpToNextLevel}</Text>
              </View>
              <View style={styles.expBg}>
                <View style={[styles.expFill, { width: `${(progress.xp / progress.xpToNextLevel) * 100}%` }]} />
              </View>
            </View>
          </ScrollView>
        );
        break;
      case 'quests':
        title = "QUÊTES EN COURS";
        content = <QuestView tasks={tasks} addTask={addTask} completeTask={completeTask} deleteTask={deleteTask} />;
        break;
      case 'boss':
        title = "CENTRE DE COMBAT";
        content = <BossView boss={boss} nextBoss={nextBoss} />;
        break;
      case 'combat':
        title = "CONTRÔLE INTÉRIEUR";
        content = <CombatView 
          user={user} 
          relapse={relapse} 
          addAddiction={addAddiction} 
          deleteAddiction={deleteAddiction}
          depressionHpState={depressionHp} 
        />;
        break;
      case 'profile':
        title = "DONNÉES DU CHASSEUR";
        content = <ProfileView 
          user={user} 
          progress={progress} 
          stats={stats} 
          history={history}
          unlockedTitles={unlockedTitles}
          updateProfile={updateProfile}
          resetGameState={resetGameState}
        />;
        break;
      default:
        content = null;
    }

    return (
      <SystemHUD title={title}>
        {content}
      </SystemHUD>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0a0a0a', '#050505']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.mainArea}>
        {renderContent()}
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNav}>
        {[
          { id: 'home', icon: Home, label: 'ACCUEIL' },
          { id: 'quests', icon: ListTodo, label: 'QUÊTES' },
          { id: 'combat', icon: Swords, label: 'COMBAT' },
          { id: 'boss', icon: LayoutDashboard, label: 'BOSS' },
          { id: 'profile', icon: UserIcon, label: 'PROFIL' }
        ].map(tab => (
          <TouchableOpacity 
            key={tab.id}
            style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <tab.icon size={20} color={activeTab === tab.id ? '#00f2ff' : '#555'} />
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  mainArea: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  // Onboarding
  onboardingContainer: { flex: 1, justifyContent: 'center' },
  onboardingContent: { padding: 30, alignItems: 'center' },
  hunterTitle: { fontSize: 32, fontWeight: '900', color: '#00f2ff', fontStyle: 'italic' },
  hunterSubtitle: { fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 4, marginBottom: 40 },
  inputCard: { width: '100%', marginBottom: 30 },
  label: { fontSize: 10, color: '#00f2ff', fontWeight: 'bold', marginBottom: 10, letterSpacing: 2 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', padding: 15, borderRadius: 5, borderWidth: 1, borderColor: 'rgba(0,242,255,0.2)' },
  sexSelection: { flexDirection: 'row', gap: 10, marginBottom: 40 },
  sexBtn: { flex: 1, padding: 15, borderWidth: 1, borderColor: '#333', alignItems: 'center' },
  sexBtnActive: { borderColor: '#00f2ff', backgroundColor: 'rgba(0,242,255,0.1)' },
  sexBtnText: { color: '#555', fontWeight: 'bold' },
  sexBtnTextActive: { color: '#00f2ff' },
  startBtn: { backgroundColor: '#00f2ff', paddingVertical: 18, width: '100%', alignItems: 'center' },
  startBtnText: { fontWeight: '900', color: '#000', fontSize: 16 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  rankText: { color: '#00f2ff', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  userName: { color: '#fff', fontSize: 28, fontWeight: '900', fontStyle: 'italic' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,165,0,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  streakText: { color: '#ffa500', fontWeight: '900', fontSize: 12 },

  // Wheel
  wheelSection: { alignItems: 'center', marginVertical: 30 },

  // Quote
  quoteBox: { backgroundColor: 'rgba(255,255,255,0.02)', padding: 25, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(0,242,255,0.1)', overflow: 'hidden' },
  quoteText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontStyle: 'italic', textAlign: 'center', lineHeight: 22 },
  scanLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(0,242,255,0.3)' },

  // EXP
  expSection: { marginTop: 30 },
  expHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  levelText: { color: '#00f2ff', fontWeight: 'bold' },
  expValue: { color: '#555', fontSize: 12 },
  expBg: { height: 6, backgroundColor: '#111', borderRadius: 3, overflow: 'hidden' },
  expFill: { height: '100%', backgroundColor: '#00f2ff' },

  // Nav
  tabNav: { flexDirection: 'row', backgroundColor: '#050505', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingVertical: 10, position: 'absolute', bottom: 0, left: 0, right: 0 },
  tabItem: { flex: 1, alignItems: 'center', gap: 4 },
  tabLabel: { fontSize: 8, color: '#555', fontWeight: 'bold' },
  tabLabelActive: { color: '#00f2ff' },
});

export default App;
