import React from 'react';
import { View, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import Svg, { Circle, G, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { 
  Sword, 
  Brain, 
  Scroll, 
  Sparkles, 
  Coins, 
  Heart, 
  Palette, 
  Zap 
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = width * 0.9;
const RADIUS = (WHEEL_SIZE / 2) - 40;
const CENTER = WHEEL_SIZE / 2;
const STROKE_WIDTH = 10;

const STAT_CONFIG = [
  { key: 'force', label: 'Force', color: '#FF0055', icon: Sword },
  { key: 'intelligence', label: 'Intel', color: '#00C2FF', icon: Brain },
  { key: 'discipline', label: 'Disc.', color: '#9D00FF', icon: Scroll },
  { key: 'charisma', label: 'Soc.', color: '#FFD700', icon: Sparkles },
  { key: 'wealth', label: 'Rich.', color: '#4CAF50', icon: Coins },
  { key: 'health', label: 'Santé', color: '#FF4D4D', icon: Heart },
  { key: 'style', label: 'Style', color: '#FF9F43', icon: Palette },
  { key: 'mental', label: 'Mental', color: '#00D2D3', icon: Zap },
];

const StatWheel = ({ stats, userSexe }) => {
  const avatarImg = userSexe === 'femme' 
    ? require('../../assets/pfp_female.png') 
    : require('../../assets/pfp_male.png');

  return (
    <View style={styles.container}>
      {/* Decorative Outer Rings */}
      <View style={styles.decorativeRings}>
        <View style={[styles.ring, { width: WHEEL_SIZE * 0.8, height: WHEEL_SIZE * 0.8, borderColor: 'rgba(0,242,255,0.1)' }]} />
        <View style={[styles.ring, { width: WHEEL_SIZE * 0.65, height: WHEEL_SIZE * 0.65, borderColor: 'rgba(0,242,255,0.05)' }]} />
      </View>

      <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
        <Defs>
          <LinearGradient id="glow" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="rgba(0,242,255,0.2)" />
            <Stop offset="1" stopColor="#00f2ff" />
          </LinearGradient>
        </Defs>

        <G transform={`translate(${CENTER}, ${CENTER})`}>
          {STAT_CONFIG.map((stat, i) => {
            const angle = (i * 360) / STAT_CONFIG.length;
            const value = stats[stat.key] || 10;
            const segmentAngle = 360 / STAT_CONFIG.length;
            const startAngle = i * segmentAngle;
            const endAngle = startAngle + (segmentAngle * 0.9);
            
            // Convert polar to cartesian
            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = ((startAngle + (segmentAngle * 0.8)) - 90) * (Math.PI / 180);
            const valRad = ((startAngle + (segmentAngle * 0.8 * (value / 100))) - 90) * (Math.PI / 180);

            const xStart = RADIUS * Math.cos(startRad);
            const yStart = RADIUS * Math.sin(startRad);
            const xEnd = RADIUS * Math.cos(endRad);
            const yEnd = RADIUS * Math.sin(endRad);
            const xVal = RADIUS * Math.cos(valRad);
            const yVal = RADIUS * Math.sin(valRad);

            const largeArc = 0;

            return (
              <G key={stat.key}>
                {/* Background segment */}
                <Path
                  d={`M ${xStart} ${yStart} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${xEnd} ${yEnd}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={STROKE_WIDTH}
                  strokeLinecap="round"
                />
                {/* Active segment */}
                <Path
                  d={`M ${xStart} ${yStart} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${xVal} ${yVal}`}
                  fill="none"
                  stroke={stat.color}
                  strokeWidth={STROKE_WIDTH}
                  strokeLinecap="round"
                />
              </G>
            );
          })}
        </G>
      </Svg>

      {/* Avatar Central */}
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarBorder}>
          <Image source={avatarImg} style={styles.avatar} resizeMode="cover" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  decorativeRings: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 500,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  avatarWrapper: {
    position: 'absolute',
    width: WHEEL_SIZE * 0.45,
    height: WHEEL_SIZE * 0.45,
    borderRadius: 1000,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: 'rgba(0,242,255,0.3)',
    elevation: 10,
    shadowColor: '#00f2ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  avatarBorder: {
    flex: 1,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});

export default StatWheel;
