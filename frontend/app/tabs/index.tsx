import { FontLoader } from '@/components/FontLoader';
import { getUserProfile } from '@/services/auth';
import { chapterProgressService } from '@/services/chapterProgress';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Chapter {
  id: number;
  title: string;
  locked: boolean;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  streak: number;
  createdAt: string;
}

const { width } = Dimensions.get('window');

/* ---------------------
   Animated Chapter Circle
   - simple Animated API (safe, works in Expo)
   - floating, press scale, completed bounce
   --------------------- */
const ChapterCircle = ({ chapter, onPress }: { chapter: Chapter; onPress: () => void }) => {
  // Safety: always expect a chapter object
  if (!chapter) return <View style={{ width: 96, height: 96 }} />;

  const floatAnim = useRef(new Animated.Value(0)).current; // -1 .. 1
  const pressAnim = useRef(new Animated.Value(1)).current; // scale
  const completedScale = useRef(new Animated.Value(1)).current;

  const isCompleted = chapterProgressService.getCompletedChapters().includes(chapter.id);

  useEffect(() => {
    // Floating loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -1,
          duration: 1800 + Math.random() * 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1800 + Math.random() * 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  useEffect(() => {
    if (isCompleted) {
      // tiny bounce when completed status appears
      completedScale.setValue(0.6);
      Animated.spring(completedScale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }
  }, [isCompleted, completedScale]);

  const translateY = floatAnim.interpolate({ inputRange: [-1, 1], outputRange: [-6, 6] });

  const onPressIn = () => {
    Animated.spring(pressAnim, { toValue: 0.95, friction: 6, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(pressAnim, { toValue: 1, friction: 6, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.circleContainer}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={chapter.locked}
        style={{ alignItems: 'center' }}
      >
        <Animated.View
          style={[
            styles.chapterCircle,
            chapter.locked && styles.chapterCircleLocked,
            isCompleted && styles.chapterCircleCompleted,
            { transform: [{ translateY }, { scale: pressAnim }] },
          ]}
        >
          {chapter.locked ? (
            <Ionicons name="lock-closed" size={32} color="#374151" />
          ) : isCompleted ? (
            <Animated.View style={{ transform: [{ scale: completedScale }] }}>
              <Ionicons name="checkmark" size={40} color="#fff" />
            </Animated.View>
          ) : (
            <View style={styles.chapterIcon} />
          )}
        </Animated.View>
      </Pressable>

      <Text style={styles.chapterTitle}>{chapter.title ?? ''}</Text>

      {isCompleted && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedBadgeText}>✓</Text>
        </View>
      )}
    </View>
  );
};

export default function HomeIndexScreen() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [tapCount, setTapCount] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [streak, setStreak] = useState<number>(0);

  // Animated streak value
  const streakAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        if (profile) {
          setUserProfile(profile);
          setStreak(profile.streak || 0);
          streakAnim.setValue(profile.streak || 0);
        }
      } catch (err) {
        console.error('Error fetching profile', err);
      }
    };

    fetchProfile();
  }, [streakAnim]);

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

    updateChapters();
    const unsubscribe = chapterProgressService.subscribe(updateChapters);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // animate streak when it changes
    Animated.timing(streakAnim, {
      toValue: streak,
      duration: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [streak, streakAnim]);

  const handleChapterPress = (chapterId: number) => {
    if (chapterProgressService.isChapterUnlocked(chapterId)) {
      router.push({ pathname: `/learn/[chapterId]`, params: { chapterId: chapterId.toString() } });
    }
  };

  const handleTitleTap = () => {
    const newTap = tapCount + 1;
    setTapCount(newTap);
    if (newTap === 5) {
      Alert.alert('Developer Options', 'What would you like to do?', [
        {
          text: 'Reset Progress',
          onPress: () => {
            chapterProgressService.resetProgress();
            setTapCount(0);
            Alert.alert('Success', 'Progress has been reset');
          },
        },
        {
          text: 'Unlock All Chapters',
          onPress: () => {
            chapterProgressService.completeChaptersUpTo(7);
            setTapCount(0);
            Alert.alert('Success', 'All chapters unlocked');
          },
        },
        { text: 'Cancel', onPress: () => setTapCount(0), style: 'cancel' },
      ]);
    }
  };

  const circleLayout: number[][] = [[1], [2, 3], [4], [5, 6], [7]];

  return (
    <FontLoader>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleTitleTap} activeOpacity={0.8}>
            <Text style={styles.title}>SignBuddy</Text>
          </TouchableOpacity>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statLabel}>Streak</Text>

              <Animated.Text style={[styles.statValue, { transform: [{ scale: streakAnim.interpolate({
                inputRange: [0, Math.max(1, streak)],
                outputRange: [1, 1.08],
              }) }] }]}>
                {Math.round((streakAnim as any)._value ?? streak)}
              </Animated.Text>
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

          <TouchableOpacity style={styles.startButton} onPress={() => router.push('/learn/1')}>
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        </View>

        {/* Chapters */}
        <ScrollView style={styles.chaptersScroll} contentContainerStyle={styles.chaptersContainer} showsVerticalScrollIndicator={false}>
          {circleLayout.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.circleRow}>
              {row.map((chapterId) => {
                const chapter = chapters.find((c) => c.id === chapterId);

                // ALWAYS return an element (placeholder when missing) to avoid RN rendering raw values
                if (!chapter) {
                  return (
                    <View key={`placeholder-${chapterId}`} style={{ width: 96, height: 96, marginHorizontal: 20 }} />
                  );
                }

                return (
                  <View key={chapterId}>
                    <ChapterCircle chapter={chapter} onPress={() => handleChapterPress(chapter.id)} />
                  </View>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </FontLoader>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbd932a5' },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 32, color: '#1F2937', marginBottom: 0, fontFamily: 'IrishGrover' },
  statsContainer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16 },
  statItem: { alignItems: 'center', marginLeft: 8 },
  statEmoji: { fontSize: 24, marginBottom: 4 },
  statLabel: { fontSize: 11, fontWeight: '600', color: '#374151' },
  statValue: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' },
  lessonCard: { marginHorizontal: 24, marginBottom: 16, backgroundColor: '#67E8F9', borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  lessonInfo: { flex: 1 },
  lessonLabel: { fontSize: 11, color: '#374151', marginBottom: 4 },
  lessonTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  progressBar: { width: 120, height: 8, backgroundColor: '#FFF', borderRadius: 4, overflow: 'hidden' },
  progressFill: { width: '50%', height: '100%', backgroundColor: '#A855F7', borderRadius: 4 },
  startButton: { backgroundColor: '#A855F7', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  startButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  chaptersScroll: { flex: 1 },
  chaptersContainer: { paddingVertical: 16, paddingBottom: 100 },
  circleRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 40, paddingHorizontal: 20 },
  circleContainer: { alignItems: 'center', marginHorizontal: 20 },
  chapterCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#D1D5DB', borderWidth: 4, borderColor: '#67E8F9', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 4 },
  chapterCircleLocked: { backgroundColor: '#9CA3AF', borderColor: '#6B7280' },
  chapterCircleCompleted: { backgroundColor: '#10B981', borderColor: '#047857' },
  chapterIcon: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  chapterTitle: { marginTop: 8, fontSize: 14, fontWeight: '600', color: '#1F2937', textAlign: 'center' },
  completedBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#10B981', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  completedBadgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
});
