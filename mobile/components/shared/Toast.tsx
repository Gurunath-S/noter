import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { palette } from '../../theme/colors';
import { Radii } from '../../constants/Theme';

export type ToastType = 'success' | 'info' | 'error' | 'warning';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

// Global dispatcher for direct showToast() calls outside of React hooks
let globalToastFn: ((message: string, type?: ToastType) => void) | null = null;

export const showToast = (message: string, type: ToastType = 'success') => {
  if (globalToastFn) {
    globalToastFn(message, type);
  }
};

export const ToastProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    visible: boolean;
  }>({
    message: '',
    type: 'success',
    visible: false,
  });

  const [fadeAnim] = useState(new Animated.Value(0));

  const triggerToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type, visible: true });
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.delay(2200),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    });
  }, [fadeAnim]);

  useEffect(() => {
    globalToastFn = triggerToast;
    return () => {
      globalToastFn = null;
    };
  }, [triggerToast]);

  const getBorderColor = () => {
    if (toast.type === 'success') return palette.emerald;
    if (toast.type === 'error') return palette.rose;
    if (toast.type === 'warning') return palette.amber;
    return palette.primary;
  };

  const getIcon = () => {
    if (toast.type === 'success') return '✨';
    if (toast.type === 'error') return '⚠️';
    if (toast.type === 'warning') return '⚡';
    return '💡';
  };

  return (
    <ToastContext.Provider value={{ showToast: triggerToast }}>
      {children}
      {toast.visible && (
        <Animated.View
          style={[
            styles.toast,
            {
              opacity: fadeAnim,
              borderColor: getBorderColor(),
            },
          ]}
        >
          <Text style={styles.icon}>{getIcon()}</Text>
          <Text style={styles.message}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const ToastContainer = ToastProvider;

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 54,
    alignSelf: 'center',
    backgroundColor: 'rgba(19, 24, 35, 0.95)',
    borderWidth: 1,
    borderRadius: Radii.card,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
    zIndex: 9999,
    maxWidth: '90%',
  },
  icon: {
    fontSize: 16,
    marginRight: 10,
  },
  message: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
