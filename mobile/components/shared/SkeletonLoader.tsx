import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { palette } from '../../theme/colors';
import { Radii } from '../../constants/Theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = Radii.sm,
  style,
}) => {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.row}>
        <Skeleton width={80} height={22} borderRadius={11} />
        <Skeleton width={60} height={22} borderRadius={11} />
      </View>
      <Skeleton width="85%" height={24} style={{ marginVertical: 12 }} />
      <Skeleton width="100%" height={16} style={{ marginBottom: 6 }} />
      <Skeleton width="70%" height={16} style={{ marginBottom: 14 }} />
      <View style={styles.row}>
        <Skeleton width={50} height={18} borderRadius={9} />
        <Skeleton width={60} height={18} borderRadius={9} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: palette.surfaceHighlight,
  },
  cardContainer: {
    backgroundColor: palette.surface,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
