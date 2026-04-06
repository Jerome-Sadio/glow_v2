import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../constants/Theme';

export const SystemHUD = ({ children, title }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[Theme.colors.background, '#1a1a1a', Theme.colors.background]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLine} />
          <Text style={styles.headerTitle}>{title || '[ SYSTEM HUD ]'}</Text>
          <View style={styles.headerLine} />
        </View>

        <View style={styles.content}>
          {children}
        </View>

        {/* Holographic Border Effect */}
        <View style={styles.borderTop} />
        <View style={styles.borderBottom} />
        <View style={styles.borderLeft} />
        <View style={styles.borderRight} />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  gradient: {
    flex: 1,
    padding: Theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.lg,
    marginTop: Theme.spacing.sm,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Theme.colors.primary,
    opacity: 0.5,
  },
  headerTitle: {
    color: Theme.colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: Theme.spacing.md,
    letterSpacing: 2,
    textShadowColor: Theme.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  content: {
    flex: 1,
  },
  borderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Theme.colors.primary,
    opacity: 0.3,
  },
  borderBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Theme.colors.primary,
    opacity: 0.3,
  },
  borderLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 2,
    backgroundColor: Theme.colors.primary,
    opacity: 0.3,
  },
  borderRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 2,
    backgroundColor: Theme.colors.primary,
    opacity: 0.3,
  },
});
