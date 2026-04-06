import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SystemHUD } from './src/components/SystemHUD';
import { Theme } from './src/constants/Theme';
import { useGameState } from './src/hooks/useGameState';

const { width } = Dimensions.get('window');

export default function App() {
  const { user, stats, quests, updateQuest, loading } = useGameState();

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: Theme.colors.background }]}>
        <Text style={{ color: Theme.colors.primary }}>INITIALIZING SYSTEM...</Text>
      </View>
    );
  }

  const expProgress = (user.exp / user.expToNextLevel) * 100;

  return (
    <SystemHUD title="[ HUNTER STATUS ]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.row}>
            <View>
              <Text style={styles.rankLabel}>RANK</Text>
              <Text style={styles.rankValue}>{user.rank}</Text>
            </View>
            <View style={styles.levelContainer}>
              <Text style={styles.levelLabel}>LEVEL</Text>
              <Text style={styles.levelValue}>{user.level}</Text>
            </View>
          </View>

          <Text style={styles.userName}>{user.name}</Text>

          {/* EXP Bar */}
          <View style={styles.expBarContainer}>
            <View style={styles.expBarLabelRow}>
              <Text style={styles.expLabel}>EXP</Text>
              <Text style={styles.expProgressText}>{user.exp} / {user.expToNextLevel}</Text>
            </View>
            <View style={styles.expBarBackground}>
              <LinearGradient
                colors={[Theme.colors.primary, Theme.colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.expBarFill, { width: `${expProgress}%` }]}
              />
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>[ ATTRIBUTES ]</Text>
        </View>
        <View style={styles.statsGrid}>
          {Object.entries(stats).map(([key, value]) => (
            <View key={key} style={styles.statItem}>
              <Text style={styles.statLabel}>{key.toUpperCase()}</Text>
              <Text style={styles.statValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Quests Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>[ DAILY QUESTS ]</Text>
        </View>
        {quests.map((quest) => (
          <TouchableOpacity 
            key={quest.id} 
            style={[styles.questCard, quest.completed && styles.questCompleted]}
            onPress={() => updateQuest(quest.id, 10)}
            activeOpacity={0.7}
          >
            <View style={styles.questInfo}>
              <Text style={styles.questTitle}>{quest.title}</Text>
              <Text style={styles.questProgress}>
                {quest.current} / {quest.goal}
              </Text>
            </View>
            <View style={styles.questReward}>
              <Text style={styles.rewardLabel}>REWARD</Text>
              <Text style={styles.rewardValue}>EXP +{quest.reward}</Text>
            </View>
            {quest.completed && <View style={styles.checkIcon}><Text style={styles.checkText}>✓</Text></View>}
          </TouchableOpacity>
        ))}
        
        <View style={{ height: 40 }} />
      </ScrollView>
      <StatusBar style="light" />
    </SystemHUD>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: Theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,242,255,0.2)',
    marginBottom: Theme.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankLabel: {
    color: Theme.colors.primary,
    fontSize: 12,
    letterSpacing: 1,
  },
  rankValue: {
    color: Theme.colors.accent,
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: Theme.colors.primary,
    textShadowRadius: 5,
  },
  levelContainer: {
    alignItems: 'flex-end',
  },
  levelLabel: {
    color: Theme.colors.primary,
    fontSize: 12,
    letterSpacing: 1,
  },
  levelValue: {
    color: Theme.colors.accent,
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    color: Theme.colors.accent,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: Theme.spacing.sm,
    letterSpacing: 2,
    textAlign: 'center',
  },
  expBarContainer: {
    marginTop: Theme.spacing.lg,
  },
  expBarLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  expLabel: {
    color: Theme.colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  expProgressText: {
    color: Theme.colors.textDim,
    fontSize: 10,
  },
  expBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  expBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,242,255,0.3)',
    marginBottom: Theme.spacing.md,
    paddingBottom: 4,
  },
  sectionTitle: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  statItem: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: Theme.spacing.sm,
    borderRadius: 4,
    marginBottom: Theme.spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: Theme.colors.secondary,
  },
  statLabel: {
    color: Theme.colors.textDim,
    fontSize: 10,
    letterSpacing: 1,
  },
  statValue: {
    color: Theme.colors.accent,
    fontSize: 18,
    fontWeight: 'bold',
  },
  questCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: Theme.spacing.md,
    borderRadius: 4,
    marginBottom: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  questCompleted: {
    borderColor: Theme.colors.success,
    opacity: 0.6,
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    color: Theme.colors.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
  questProgress: {
    color: Theme.colors.textDim,
    fontSize: 12,
  },
  questReward: {
    alignItems: 'flex-end',
  },
  rewardLabel: {
    color: Theme.colors.primary,
    fontSize: 8,
  },
  rewardValue: {
    color: Theme.colors.success,
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkIcon: {
    marginLeft: Theme.spacing.sm,
  },
  checkText: {
    color: Theme.colors.success,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
