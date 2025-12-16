import { chapterProgressService } from '@/services/chapterProgress';
import { getSignLanguageAssets } from '@/services/cloudinary';
import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface SignAsset {
  public_id: string;
  secure_url: string;
  folder: string;
}

interface ColorLesson {
  name: string;
  videoUrl: string;
}

export default function LearnChapter() {
  const router = useRouter();
  const { chapterId } = useLocalSearchParams();
  const [assets, setAssets] = useState<SignAsset[]>([]);
  const [basicLessons, setBasicLessons] = useState<ColorLesson[]>([]);
  const [colorLessons, setColorLessons] = useState<ColorLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [showBasics, setShowBasics] = useState(true); // Start with basics

  // Map chapter IDs to folder names in Cloudinary
  const chapterFolders: Record<string, string> = {
    '1': 'asl_alphabets',
    '2': 'asl_numbers',
    '3': 'asl_alphabets',
    '4': 'asl_numbers',
    '5': 'asl_alphabets',
    '6': 'asl_numbers',
    '7': 'asl_alphabets',
  };

  const chapterTitles: Record<string, string> = {
    '1': 'Greetings',
    '2': 'Family',
    '3': 'Numbers',
    '4': 'Colors',
    '5': 'Food',
    '6': 'Animals',
    '7': 'Weather',
  };

  // Special data for Colors chapter - Main Colors
  const defaultColorLessons: ColorLesson[] = [
    { name: 'Black', videoUrl: '/signs/color/black.mp4' },
    { name: 'Beige', videoUrl: '/signs/color/beige.mp4' },
    { name: 'Blond', videoUrl: '/signs/color/blond.mp4' },
    { name: 'Blue', videoUrl: '/signs/color/blue.mp4' },
    { name: 'Brown', videoUrl: '/signs/color/brown.mp4' },
    { name: 'Golden', videoUrl: '/signs/color/golden.mp4' },
    { name: 'Green', videoUrl: '/signs/color/green.mp4' },
    { name: 'Grey', videoUrl: '/signs/color/grey.mp4' },
    { name: 'Orange', videoUrl: '/signs/color/orange.mp4' },
    { name: 'Pale', videoUrl: '/signs/color/pale.mp4' },
    { name: 'Pink', videoUrl: '/signs/color/pink.mp4' },
    { name: 'Purple', videoUrl: '/signs/color/purple.mp4' },
    { name: 'Red', videoUrl: '/signs/color/red.mp4' },
    { name: 'Silver', videoUrl: '/signs/color/silver.mp4' },
    { name: 'Violet', videoUrl: '/signs/color/violet.mp4' },
    { name: 'White', videoUrl: '/signs/color/white.mp4' },
    { name: 'Yellow', videoUrl: '/signs/color/yellow.mp4' }
  ];
  useEffect(() => {
    const fetchData = async () => {
      if (!chapterId || Array.isArray(chapterId)) return;
      
      setLoading(true);
      try {
        // Special handling for Colors chapter (id: 4)
        if (chapterId === '4') {
          // For Colors chapter, we use local files
          setAssets([]);
          
          // Fetch basic color concepts from backend
          try {
            const basicResponse = await fetch('http://192.168.1.11:3000/api/colors/basic');
            if (!basicResponse.ok) {
              throw new Error(`HTTP error! status: ${basicResponse.status}`);
            }
            const basicData = await basicResponse.json();
            // Validate that we received an array
            if (Array.isArray(basicData)) {
              setBasicLessons(basicData);
            } else {
              throw new Error('Invalid data format received from server');
            }
          } catch (error) {
            console.error('Error fetching basic lessons:', error);
            // Fallback to default basic lessons
            setBasicLessons([
              { name: 'What Is Color?', videoUrl: '/signs/basic_colors/what_is_color.gif' },
              { name: 'Light And Color', videoUrl: '/signs/basic_colors/light_and_color.gif' },
              { name: 'Primary Colors', videoUrl: '/signs/basic_colors/primary_colors.gif' },
              { name: 'Secondary Colors', videoUrl: '/signs/basic_colors/secondary_colors.gif' },
              { name: 'Warm Colors', videoUrl: '/signs/basic_colors/warm_colors.gif' },
              { name: 'Cool Colors', videoUrl: '/signs/basic_colors/cool_colors.gif' }
            ]);
          }          
          // Set color lessons
          setColorLessons(defaultColorLessons);
        } else {
          const folderName = chapterFolders[chapterId];
          if (!folderName) {
            throw new Error('Invalid chapter');
          }
          
          const data = await getSignLanguageAssets(folderName);
          console.log('Fetched assets:', data);
          setAssets(data);
          
          // Clear color lessons for other chapters
          setBasicLessons([]);
          setColorLessons([]);
        }
        
        // Reset color index when switching chapters
        setCurrentColorIndex(0);
        setShowBasics(true); // Reset to basics when switching chapters
        
        // Check if chapter is already completed
        const completedChapters = chapterProgressService.getCompletedChapters();
        if (completedChapters.includes(parseInt(chapterId as string))) {
          setCompleted(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load lessons. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chapterId]);

  const handleCompleteChapter = () => {
    if (!chapterId || Array.isArray(chapterId)) return;
    
    const chapterIdNum = parseInt(chapterId as string);
    
    // Mark chapter as completed
    chapterProgressService.completeChapter(chapterIdNum);
    setCompleted(true);
    
    Alert.alert(
      'Chapter Completed!',
      'You have unlocked the next chapter.',
      [
        {
          text: 'Continue',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleNextColor = () => {
    const lessons = showBasics ? basicLessons : colorLessons;
    
    if (currentColorIndex < lessons.length - 1) {
      // Move to next item in current section
      setCurrentColorIndex(prevIndex => prevIndex + 1);
    } else if (showBasics && basicLessons.length > 0) {
      // Finished basics, move to main colors
      setShowBasics(false);
      setCurrentColorIndex(0);
    }
    // If we're at the end of main colors, do nothing (complete button will be shown)
  };

  const handlePreviousColor = () => {
    if (currentColorIndex > 0) {
      // Move to previous item in current section
      setCurrentColorIndex(prevIndex => prevIndex - 1);
    } else if (!showBasics && basicLessons.length > 0) {
      // At start of main colors, move back to basics
      setShowBasics(true);
      setCurrentColorIndex(basicLessons.length - 1);
    }
    // If we're at the start of basics, do nothing
  };

  const renderAsset = ({ item }: { item: SignAsset }) => {
    // Extract the sign name from the public_id (everything after the last slash and before the extension)
    const signName = item.public_id.split('/').pop()?.split('.')[0] || '';
    
    return (
      <View style={styles.assetContainer}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.secure_url }} 
            style={styles.signImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.signName}>{signName.replace(/_/g, ' ')}</Text>
      </View>
    );
  };

  // Special render for Colors chapter with sequential flow
  const renderColorsChapter = () => {
    // Handle case where we haven't loaded lessons yet
    if ((showBasics && basicLessons.length === 0) || (!showBasics && colorLessons.length === 0)) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#67E8F9" />
          <Text style={styles.loadingText}>Loading color lessons...</Text>
        </View>
      );
    }
    
    const lessons = showBasics ? basicLessons : colorLessons;
    const currentColor = lessons[currentColorIndex];
    const isAtStart = showBasics && currentColorIndex === 0;
    const isAtEnd = !showBasics && currentColorIndex === colorLessons.length - 1;
    
    return (
      <View style={styles.colorsContainer}>
        <Text style={styles.colorName}>{currentColor.name}</Text>
        <View style={styles.colorVideoContainer}>
          {currentColor.videoUrl.endsWith('.gif') ? (
            <Image 
              source={{ uri: currentColor.videoUrl.startsWith('http') ? currentColor.videoUrl : `http://192.168.1.3:3000${currentColor.videoUrl}` }} 
              style={styles.colorVideo}
              resizeMode="contain"
            />
          ) : (
            <Video
              source={{ uri: currentColor.videoUrl.startsWith('http') ? currentColor.videoUrl : `http://192.168.1.3:3000${currentColor.videoUrl}` }}
              style={styles.colorVideo}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              isLooping
              isMuted
            />
          )}        </View>
        <View style={styles.navigationContainer}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={handlePreviousColor}
            disabled={isAtStart}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={isAtStart ? '#9CA3AF' : '#1F2937'} 
            />
          </TouchableOpacity>
          
          <Text style={styles.pageIndicator}>
            {showBasics ? 'Basics' : 'Colors'} {currentColorIndex + 1} / {lessons.length}
          </Text>
          
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={handleNextColor}
            disabled={isAtEnd}
          >
            <Ionicons 
              name="arrow-forward" 
              size={24} 
              color={isAtEnd ? '#9CA3AF' : '#1F2937'} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Show section indicator */}
        <View style={styles.sectionIndicator}>
          <Text style={[styles.sectionText, showBasics && styles.activeSection]}>
            Basic Concepts
          </Text>
          <Text style={styles.separator}>•</Text>
          <Text style={[styles.sectionText, !showBasics && styles.activeSection]}>
            Main Colors
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#67E8F9" />
          <Text style={styles.loadingText}>Loading lessons...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{chapterTitles[chapterId as string] || 'Lesson'}</Text>
          <Text style={styles.chapterIndicator}>Chapter {chapterId}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {chapterId === '4' ? (
        // Special rendering for Colors chapter with sequential flow
        <>
          {renderColorsChapter()}
          
          {!completed && (
            <TouchableOpacity style={styles.completeButton} onPress={handleCompleteChapter}>
              <Text style={styles.completeButtonText}>Complete Chapter</Text>
            </TouchableOpacity>
          )}
          
          {completed && (
            <View style={styles.completedBanner}>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.completedText}>Chapter Completed!</Text>
            </View>
          )}
        </>
      ) : assets.length > 0 ? (
        // Regular rendering for other chapters
        <>
          <FlatList
            data={assets}
            renderItem={renderAsset}
            keyExtractor={(item) => item.public_id}
            numColumns={2}
            contentContainerStyle={styles.assetsContainer}
            columnWrapperStyle={styles.columnWrapper}
          />
          
          {!completed && (
            <TouchableOpacity style={styles.completeButton} onPress={handleCompleteChapter}>
              <Text style={styles.completeButtonText}>Complete Chapter</Text>
            </TouchableOpacity>
          )}
          
          {completed && (
            <View style={styles.completedBanner}>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.completedText}>Chapter Completed!</Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No lessons available for this chapter.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbd932a5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#1F2937',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'IrishGrover',
  },
  chapterIndicator: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  assetsContainer: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  assetContainer: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  signImage: {
    width: '100%',
    height: '100%',
  },
  signName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  colorsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  colorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    fontFamily: 'IrishGrover',
  },
  colorVideoContainer: {
    width: 250,
    height: 250,
    borderRadius: 125,
    overflow: 'hidden',
    marginBottom: 30,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  colorVideo: {
    width: '100%',
    height: '100%',
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  navButton: {
    padding: 10,
  },
  pageIndicator: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  sectionText: {
    fontSize: 16,
    color: '#6B7280',
    marginHorizontal: 5,
  },
  activeSection: {
    color: '#1F2937',
    fontWeight: 'bold',
  },
  separator: {
    fontSize: 16,
    color: '#6B7280',
  },
  completeButton: {
    backgroundColor: '#A855F7',
    marginHorizontal: 24,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  completedBanner: {
    backgroundColor: '#10B981',
    marginHorizontal: 24,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  completedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#1F2937',
  },
});