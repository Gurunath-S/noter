import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Idea } from '../../../types/idea';
import { palette } from '../../../theme/colors';
import { Radii } from '../../../constants/Theme';

export interface ConvertToProjectModalProps {
  visible: boolean;
  idea: Idea | null;
  onClose: () => void;
  onConfirm: (data?: any) => void | Promise<void>;
  isConverting?: boolean;
}

export const ConvertToProjectModal: React.FC<ConvertToProjectModalProps> = ({
  visible,
  idea,
  onClose,
  onConfirm,
  isConverting = false,
}) => {
  if (!idea) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🚀</Text>
          </View>

          <Text style={styles.title}>Promote to Active Project</Text>
          <Text style={styles.subtitle}>
            Ready to build <Text style={styles.boldText}>"{idea.title}"</Text>? This will create a project workspace with:
          </Text>

          <View style={styles.featureList}>
            <View style={styles.featureRow}>
              <Text style={styles.bullet}>✓</Text>
              <Text style={styles.featureText}>
                {idea.checklist.length} checklist items migrated to milestone tasks
              </Text>
            </View>
            <View style={styles.featureRow}>
              <Text style={styles.bullet}>✓</Text>
              <Text style={styles.featureText}>Problem & Solution statements preserved</Text>
            </View>
            <View style={styles.featureRow}>
              <Text style={styles.bullet}>✓</Text>
              <Text style={styles.featureText}>Tech stack & tag categorization prefilled</Text>
            </View>
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={onClose}
              style={[styles.btn, styles.btnCancel]}
              disabled={isConverting}
            >
              <Text style={styles.btnCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onConfirm()}
              style={[styles.btn, styles.btnConfirm]}
              disabled={isConverting}
            >
              <Text style={styles.btnConfirmText}>
                {isConverting ? 'Creating Project...' : 'Launch Project 🔨'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 12, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: 'rgba(21, 27, 40, 0.98)',
    borderRadius: Radii.cardLg,
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.35)',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  boldText: {
    color: palette.text,
    fontWeight: '700',
  },
  featureList: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: Radii.md,
    padding: 14,
    marginBottom: 20,
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bullet: {
    color: palette.emerald,
    fontWeight: '800',
    marginRight: 8,
    fontSize: 14,
  },
  featureText: {
    color: palette.text,
    fontSize: 13,
    flex: 1,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancel: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: palette.border,
  },
  btnCancelText: {
    color: palette.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  btnConfirm: {
    backgroundColor: palette.primary,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  btnConfirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
