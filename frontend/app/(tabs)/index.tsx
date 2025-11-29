import { chapterProgressService } from '@/services/chapterProgress';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Chapter {
  id: number;
  title: string;
  locked: boolean;
}

// Reusable Circle Component
const ChapterCircle = ({ chapter, onPress }: { chapter: Chapter; onPress: () => void }) => {
  const isCompleted = chapterProgressService.getCompletedChapters().includes(chapter.id);
  
  return (
    <View style={styles.circleContainer}>
      <TouchableOpacity
        style={[
          styles.chapterCircle,
          chapter.locked && styles.chapterCircleLocked,
          isCompleted && styles.chapterCircleCompleted
        ]}
        onPress={onPress}
        disabled={chapter.locked}
      >
        {chapter.locked ? (
          <Ionicons name="lock-closed" size={32} color="#666" />
        ) : isCompleted ? (
          <Ionicons name="checkmark" size={40} color="#fff" />
        ) : (
          <View style={styles.chapterIcon} />
        )}
      </TouchableOpacity>
      <Text style={styles.chapterTitle}>{chapter.title}</Text>
      {isCompleted && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedBadgeText}>✓</Text>
        </View>
      )}
    </View>
  );
};

export default function SignBuddyApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'practice' | 'dictionary' | 'profile'>('home');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [tapCount, setTapCount] = useState(0);
  
  // Initialize chapters and set up listener for progress updates
  useEffect(() => {
    const updateChapters = () => {
      const updatedChapters: Chapter[] = [
        { id: 1, title: 'Greetings', locked: !chapterProgressService.isChapterUnlocked(1) },
        { id: 2, title: 'Family', locked: !chapterProgressService.isChapterUnlocked(2) },
        { id: 3, title: 'Numbers', locked: !chapterProgressService.isChapterUnlocked(3) },
        { id: 4, title: 'Colors', locked: !chapterProgressService.isChapterUnlocked(4) },
        { id: 5, title: 'Food', locked: !chapterProgressService.isChapterUnlocked(5) },
        { id: 6, title: 'Animals', locked: !chapterProgressService.isChapterUnlocked(6) },
        { id: 7, title: 'Weather', locked: !chapterProgressService.isChapterUnlocked(7) },
      ];
      setChapters(updatedChapters);
    };
    
    // Initial update
    updateChapters();
    
    // Subscribe to progress updates
    const unsubscribe = chapterProgressService.subscribe(updateChapters);
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleChapterPress = (chapterId: number) => {
    if (chapterProgressService.isChapterUnlocked(chapterId)) {
      router.push({
        pathname: `/learn/[chapterId]`,
        params: { chapterId: chapterId.toString() }
      });
    }
  };

  // Hidden test function - tap the title 5 times to access
  const handleTitleTap = () => {
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);
    
    if (newTapCount === 5) {
      Alert.alert(
        'Developer Options',
        'What would you like to do?',
        [
          {
            text: 'Reset Progress',
            onPress: () => {
              chapterProgressService.resetProgress();
              setTapCount(0);
              Alert.alert('Success', 'Progress has been reset');
            }
          },
          {
            text: 'Unlock All Chapters',
            onPress: () => {
              chapterProgressService.completeChaptersUpTo(7);
              setTapCount(0);
              Alert.alert('Success', 'All chapters unlocked');
            }
          },
          {
            text: 'Cancel',
            onPress: () => setTapCount(0),
            style: 'cancel'
          }
        ]
      );
    }
  };

  const circleLayout = [
    [1],           
    [2, 3], 
    [4],      
    [5, 6],
    [7],
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title} onPress={handleTitleTap}>SignBuddy</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>7</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🎯</Text>
            <Text style={styles.statLabel}>Signs</Text>
            <Text style={styles.statValue}>80</Text>
          </View>
        </View>
      </View>

      {/* Next Lesson Card */}
      <View style={styles.lessonCard}>
        <View style={styles.lessonInfo}>
          <Text style={styles.lessonLabel}>Next lesson</Text>
          <Text style={styles.lessonTitle}>Time of Day</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      </View>

      {/* Arc-style Chapters */}
      <ScrollView 
        style={styles.chaptersScroll}
        contentContainerStyle={styles.chaptersContainer}
        showsVerticalScrollIndicator={false}
      >
        {circleLayout.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.circleRow}>
            {row.map(chapterId => {
              const chapter = chapters.find(ch => ch.id === chapterId);
              return chapter ? (
                <ChapterCircle 
                  key={chapter.id}
                  chapter={chapter}
                  onPress={() => handleChapterPress(chapter.id)}
                />
              ) : null;
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Keep your existing styles...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbd932a5',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 32,
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'IrishGrover', 
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  lessonCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: '#67E8F9',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonLabel: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 4,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  progressBar: {
    width: 120,
    height: 8,
    backgroundColor: '#FFF',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    width: '50%',
    height: '100%',
    backgroundColor: '#A855F7',
    borderRadius: 4,
  },
  startButton: {
    backgroundColor: '#A855F7',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  chaptersScroll: {
    flex: 1,
  },
  chaptersContainer: {
    paddingVertical: 16,
    paddingBottom: 100,
  },
  circleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  circleContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  chapterCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#D1D5DB',
    borderWidth: 4,
    borderColor: '#67E8F9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  chapterCircleLocked: {
    backgroundColor: '#9CA3AF',
    borderColor: '#6B7280',
  },
  chapterCircleCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#047857',
  },
  chapterIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  completedBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#10B981',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});