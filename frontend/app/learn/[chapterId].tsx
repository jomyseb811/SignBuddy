import { chapterProgressService } from '@/services/chapterProgress';
import { getSignLanguageAssets } from '@/services/cloudinary';
import { Ionicons } from '@expo/vector-icons';
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

export default function LearnChapter() {
  const router = useRouter();
  const { chapterId } = useLocalSearchParams();
  const [assets, setAssets] = useState<SignAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

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

  useEffect(() => {
    const fetchAssets = async () => {
      if (!chapterId || Array.isArray(chapterId)) return;
      
      setLoading(true);
      try {
        const folderName = chapterFolders[chapterId];
        if (!folderName) {
          throw new Error('Invalid chapter');
        }
        
        const data = await getSignLanguageAssets(folderName);
        console.log('Fetched assets:', data);
        setAssets(data);
        
        // Check if chapter is already completed
        const completedChapters = chapterProgressService.getCompletedChapters();
        if (completedChapters.includes(parseInt(chapterId as string))) {
          setCompleted(true);
        }
      } catch (error) {
        console.error('Error fetching assets:', error);
        Alert.alert('Error', 'Failed to load lessons. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
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

      {assets.length > 0 ? (
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