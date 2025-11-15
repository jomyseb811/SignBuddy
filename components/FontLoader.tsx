import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Font from 'expo-font';
import { IrishGrover_400Regular } from '@expo-google-fonts/irish-grover';

export const FontLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        console.log('Loading Irish Grover font...'); // Add this log
        await Font.loadAsync({
          'IrishGrover': IrishGrover_400Regular, // Try with quotes
        });
        console.log('Font loaded successfully!'); // Add this log
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading font:', error); // Add this log
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>; // Show loading text instead of null
  }

  return <>{children}</>;
};