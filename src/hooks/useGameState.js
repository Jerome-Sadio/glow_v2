import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BOSSES } from '../data/bosses';
import { QUOTES } from '../data/quotes';
import { TITLES } from '../data/titles';

const INITIAL_STATS = {
  force: 10,
  intelligence: 10,
  discipline: 10,
  charisma: 10,
  wealth: 10,
  health: 10,
  style: 10,
  mental: 10,
};

const DEFAULT_TASKS = [
  { id: '1', text: "Boire 2L d'eau", category: "health", completed: false, xp: 20, stat: "health" },
  { id: '2', text: "Séance de Sport", category: "force", completed: false, xp: 50, stat: "force" },
  { id: '3', text: "Lire 10 pages", category: "intelligence", completed: false, xp: 30, stat: "intelligence" },
  { id: '4', text: "Méditation 10min", category: "mental", completed: false, xp: 20, stat: "mental" },
];

const INITIAL_USER = {
  pseudo: 'Hunter',
  sexe: 'homme', // 'homme' | 'femme'
  onboardingComplete: false,
  addictions: [
    { id: 'tabac', name: 'Tabac', icon: '🚬', lastRelapse: new Date().toISOString(), bestStreak: 0 },
    { id: 'sucre', name: 'Malbouffe', icon: '🍔', lastRelapse: new Date().toISOString(), bestStreak: 0 },
    { id: 'porn', name: 'Pornographie', icon: '🚫', lastRelapse: new Date().toISOString(), bestStreak: 0 },
  ],
  lastDailyCheck: new Date().toISOString()
};

export const useGameState = () => {
  const [user, setUser] = useState(INITIAL_USER);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [progress, setProgress] = useState({ level: 1, xp: 0, xpToNextLevel: 100 });
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [history, setHistory] = useState([]);
  const [unlockedTitles, setUnlockedTitles] = useState(['novice']);
  const [bossIndex, setBossIndex] = useState(0);
  const [bossHp, setBossHp] = useState(BOSSES[0].hp);
  const [depressionHp, setDepressionHp] = useState(BOSSES[4].hp);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const rank = useMemo(() => {
    const lvl = progress.level;
    if (lvl >= 100) return 'S';
    if (lvl >= 80) return 'A';
    if (lvl >= 60) return 'B';
    if (lvl >= 40) return 'C';
    if (lvl >= 20) return 'D';
    return 'E';
  }, [progress.level]);

  const currentBoss = useMemo(() => {
    const b = BOSSES[bossIndex % BOSSES.length];
    return { ...b, hp: bossHp };
  }, [bossIndex, bossHp]);

  // Persistence: Load
  useEffect(() => {
    const loadAll = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('@glow_user');
        const savedStats = await AsyncStorage.getItem('@glow_stats');
        const savedProgress = await AsyncStorage.getItem('@glow_progress');
        const savedHistory = await AsyncStorage.getItem('@glow_history');
        const savedTitles = await AsyncStorage.getItem('@glow_titles');
        const savedBossIdx = await AsyncStorage.getItem('@glow_boss_idx');
        const savedBossHp = await AsyncStorage.getItem('@glow_boss_hp');
        const savedDepressionHp = await AsyncStorage.getItem('@glow_depression_hp');
        const savedStreak = await AsyncStorage.getItem('@glow_streak');

        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedStats) setStats(JSON.parse(savedStats));
        if (savedProgress) setProgress(JSON.parse(savedProgress));
        if (savedTasks) setTasks(JSON.parse(savedTasks));
        if (savedHistory) setHistory(JSON.parse(savedHistory));
        if (savedTitles) setUnlockedTitles(JSON.parse(savedTitles));
        if (savedBossIdx) setBossIndex(parseInt(savedBossIdx));
        if (savedBossHp) setBossHp(parseFloat(savedBossHp));
        if (savedDepressionHp) setDepressionHp(parseFloat(savedDepressionHp));
        if (savedStreak) setStreak(parseInt(savedStreak));
      } catch (e) {
        console.error("Error loading state", e);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  // Persistence: Save
  useEffect(() => {
    if (loading) return;
    const saveAll = async () => {
      try {
        await AsyncStorage.setItem('@glow_user', JSON.stringify(user));
        await AsyncStorage.setItem('@glow_stats', JSON.stringify(stats));
        await AsyncStorage.setItem('@glow_progress', JSON.stringify(progress));
        await AsyncStorage.setItem('@glow_tasks', JSON.stringify(tasks));
        await AsyncStorage.setItem('@glow_history', JSON.stringify(history));
        await AsyncStorage.setItem('@glow_titles', JSON.stringify(unlockedTitles));
        await AsyncStorage.setItem('@glow_boss_idx', bossIndex.toString());
        await AsyncStorage.setItem('@glow_boss_hp', bossHp.toString());
        await AsyncStorage.setItem('@glow_depression_hp', depressionHp.toString());
        await AsyncStorage.setItem('@glow_streak', streak.toString());
      } catch (e) {
        console.error("Error saving state", e);
      }
    };
    saveAll();
  }, [user, stats, progress, tasks, history, unlockedTitles, bossIndex, bossHp, depressionHp, streak, loading]);

  // Title Unlocking Logic
  useEffect(() => {
    if (loading) return;
    
    const state = { progress, stats, bossIndex, streak };
    const newlyUnlocked = TITLES.filter(t => !unlockedTitles.includes(t.id) && t.requirement(state));
    
    if (newlyUnlocked.length > 0) {
      setUnlockedTitles(prev => [...prev, ...newlyUnlocked.map(t => t.id)]);
    }
  }, [progress, stats, bossIndex, streak, loading]);

  // Game Logic
  const addExperience = (amount) => {
    setProgress(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNextLevel;

      if (newXp >= newXpToNext) {
        newLevel += 1;
        newXp = newXp - newXpToNext;
        newXpToNext = Math.floor(newXpToNext * 1.5);
      }

      return { level: newLevel, xp: newXp, xpToNextLevel: newXpToNext };
    });
  };

  const completeTask = (taskId) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1 || tasks[taskIndex].completed) return;

    const task = tasks[taskIndex];
    
    // Move to history
    const completedTask = { ...task, completed: true, completedAt: new Date().toISOString() };
    setHistory(prev => [completedTask, ...prev].slice(0, 100)); // Keep last 100
    setTasks(prev => prev.filter(t => t.id !== taskId));

    if (task.stat) {
      setStats(prev => ({ ...prev, [task.stat]: Math.min(prev[task.stat] + 2, 100) }));
    }

    const xpReward = task.xp || 20;
    
    // Damage current boss
    setBossHp(prev => {
      const newHp = Math.max(0, prev - (xpReward / 2));
      // Procrastination (Boss 0) restarts immediately
      if (newHp === 0 && bossIndex === 0) {
        return BOSSES[0].hp;
      }
      return newHp;
    });

    // Damage Depression Boss (Eternal Battle)
    // Small damage per task completed to simulate a year-long battle
    setDepressionHp(prev => {
      const newHp = Math.max(0, prev - (xpReward / 20));
      // Depression also restarts if it ever reaches 0
      if (newHp === 0) return BOSSES[4].hp;
      return newHp;
    });

    addExperience(xpReward);
  };

  const nextBoss = () => {
    const nextIdx = bossIndex + 1;
    setBossIndex(nextIdx);
    setBossHp(BOSSES[nextIdx % BOSSES.length].hp);
  };

  const addTask = (text, category, stat, xp) => {
    const newTask = {
      id: Date.now().toString(),
      text,
      category,
      stat,
      xp,
      completed: false
    };
    setTasks(prev => [...prev, newTask]);
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const getRandomQuote = () => {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
  };

  const completeOnboarding = (pseudo, sexe) => {
    setUser(prev => ({ ...prev, pseudo, sexe, onboardingComplete: true }));
  };

  const relapse = (addictionId) => {
    setUser(prev => ({
      ...prev,
      addictions: prev.addictions.map(a => 
        a.id === addictionId ? { ...a, lastRelapse: new Date().toISOString() } : a
      )
    }));
    // Penalty: lose 10% of total XP
    setProgress(prev => ({
      ...prev,
      xp: Math.max(0, prev.xp - Math.floor(prev.xpToNextLevel * 0.1))
    }));
  };

  const addAddiction = (name, icon) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    setUser(prev => ({
      ...prev,
      addictions: [...prev.addictions, { id, name, icon, lastRelapse: new Date().toISOString(), bestStreak: 0 }]
    }));
  };

  return {
    user,
    stats,
    progress: { ...progress, rank },
    tasks,
    history,
    unlockedTitles,
    boss: currentBoss,
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
    addAddiction
  };
};
