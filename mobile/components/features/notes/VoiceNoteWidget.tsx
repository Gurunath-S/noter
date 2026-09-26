import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { palette } from '../../../theme/colors';
import { Radii } from '../../../constants/Theme';
import { useHaptics } from '../../../hooks/useHaptics';

export interface VoiceNoteWidgetProps {
  onRecordComplete?: (durationSeconds: number) => void;
  onRecorded?: (durationSeconds: number) => void;
  initialDuration?: number;
}

export const VoiceNoteWidget: React.FC<VoiceNoteWidgetProps> = ({
  onRecordComplete,
  onRecorded,
  initialDuration,
}) => {
  const haptics = useHaptics();
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(initialDuration || 0);

  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    haptics.impact();
    const completeHandler = onRecordComplete || onRecorded;
    if (isRecording) {
      setIsRecording(false);
      completeHandler?.(seconds);
    } else {
      setSeconds(0);
      setIsRecording(true);
    }
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock audio wave bars
  const waveHeights = isRecording ? [12, 28, 16, 32, 22, 14, 26, 18, 30, 20, 10] : [10, 14, 10, 18, 12, 10, 14, 10, 16, 12, 8];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggleRecording}
        style={[styles.recordBtn, isRecording && styles.recordBtnActive]}
      >
        <Text style={styles.micIcon}>{isRecording ? '⏹️' : '🎙️'}</Text>
      </TouchableOpacity>

      {/* Animated Sound Waveform */}
      <View style={styles.waveContainer}>
        {waveHeights.map((h, i) => (
          <View
            key={i}
            style={[
              styles.waveBar,
              {
                height: h,
                backgroundColor: isRecording ? palette.primaryLight : palette.textMuted,
              },
            ]}
          />
        ))}
      </View>

      <Text style={styles.timerText}>
        {isRecording || seconds > 0 ? formatTimer(seconds) : 'Voice Memo'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: Radii.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 8,
  },
  recordBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recordBtnActive: {
    backgroundColor: 'rgba(244, 63, 94, 0.25)',
    borderWidth: 1,
    borderColor: palette.rose,
  },
  micIcon: {
    fontSize: 16,
  },
  waveContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 34,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.textSecondary,
    marginLeft: 10,
  },
});
