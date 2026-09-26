import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette } from '../../../theme/colors';
import { Radii } from '../../../constants/Theme';

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <View style={styles.container}>
      {lines.map((line, index) => {
        const trimmed = line.trim();

        // Empty line
        if (!trimmed) {
          return <View key={index} style={styles.spacer} />;
        }

        // H1 header
        if (line.startsWith('# ')) {
          return (
            <Text key={index} style={styles.h1}>
              {line.replace('# ', '')}
            </Text>
          );
        }

        // H2 header
        if (line.startsWith('## ')) {
          return (
            <Text key={index} style={styles.h2}>
              {line.replace('## ', '')}
            </Text>
          );
        }

        // H3 header
        if (line.startsWith('### ')) {
          return (
            <Text key={index} style={styles.h3}>
              {line.replace('### ', '')}
            </Text>
          );
        }

        // Blockquote
        if (line.startsWith('> ')) {
          return (
            <View key={index} style={styles.blockquote}>
              <Text style={styles.blockquoteText}>{line.replace('> ', '')}</Text>
            </View>
          );
        }

        // Bullet point
        if (line.startsWith('- ') || line.startsWith('* ')) {
          const bulletContent = line.substring(2);
          return (
            <View key={index} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{bulletContent}</Text>
            </View>
          );
        }

        // Code block or inline code
        if (line.startsWith('```') || line.endsWith('```')) {
          const codeSnippet = line.replace(/```/g, '');
          return (
            <View key={index} style={styles.codeBlock}>
              <Text style={styles.codeText}>{codeSnippet || '// Code block'}</Text>
            </View>
          );
        }

        // Standard paragraph
        return (
          <Text key={index} style={styles.paragraph}>
            {line}
          </Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  spacer: {
    height: 8,
  },
  h1: {
    fontSize: 22,
    fontWeight: '800',
    color: palette.text,
    letterSpacing: -0.4,
    marginTop: 14,
    marginBottom: 6,
  },
  h2: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
    letterSpacing: -0.2,
    marginTop: 12,
    marginBottom: 6,
  },
  h3: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.primaryLight,
    marginTop: 10,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 14,
    color: palette.textSecondary,
    lineHeight: 22,
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 3,
    paddingLeft: 4,
  },
  bulletDot: {
    color: palette.primaryLight,
    fontSize: 16,
    marginRight: 8,
    lineHeight: 20,
  },
  bulletText: {
    fontSize: 14,
    color: palette.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: palette.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginVertical: 8,
  },
  blockquoteText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: palette.text,
    lineHeight: 18,
  },
  codeBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: Radii.sm,
    padding: 10,
    marginVertical: 8,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#38BDF8',
  },
});
