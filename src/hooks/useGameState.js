import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INITIAL_STATE = {
  user: {
    name: 'Hunter',
    level: 1,
    exp: 0,
    expToNextLevel: 100,
    rank: 'E',
    hp: 100,
    mp: 100,
  },
  stats: {
    strength: 10,
    agility: 10,
    sense: 10,
    vitality: 10,
    intelligence: 10,
  },
  quests: [
    { id: 1, title: 'Push-ups', goal: 100, current: 0, completed: false, reward: 10 },
    { id: 2, title: 'Sit-ups', goal: 100, current: 0, completed: false, reward: 10 },
    { id: 3, title: 'Running', goal: 10, current: 0, completed: false, reward: 20 },
  ],
  inventory: [],
};

export const useGameState = () => {
  const [state, setState] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('@glow_up_state');
      if (savedState) {
        setState(JSON.parse(savedState));
      }
    } catch (e) {
      console.error('Failed to load state', e);
    } finally {
      setLoading(false);
    }
  };

  const saveState = async (newState) => {
    try {
      await AsyncStorage.setItem('@glow_up_state', JSON.stringify(newState));
    } catch (e) {
      console.error('Failed to save state', e);
    }
  };

  const updateQuest = (id, progress) => {
    const newState = { ...state };
    const quest = newState.quests.find(q => q.id === id);
    if (quest && !quest.completed) {
      quest.current += progress;
      if (quest.current >= quest.goal) {
        quest.current = quest.goal;
        quest.completed = true;
        addExp(quest.reward);
      }
      setState(newState);
      saveState(newState);
    }
  };

  const addExp = (amount) => {
    const newState = { ...state };
    newState.user.exp += amount;
    if (newState.user.exp >= newState.user.expToNextLevel) {
      newState.user.exp -= newState.user.expToNextLevel;
      newState.user.level += 1;
      newState.user.expToNextLevel = Math.floor(newState.user.expToNextLevel * 1.5);
      // Level up logic
    }
    setState(newState);
    saveState(newState);
  };

  return { ...state, updateQuest, loading };
};
