import type { DraftSeedling } from '@/types/home';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import * as ExpoImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY;

type Props = {
  onSeedlingExtracted?: (draft: DraftSeedling) => void;
};

export function SeedPacketPicker({ onSeedlingExtracted }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Gemini extraction ────────────────────────────────────────────────────

  const extractSeedlingFromText = async (text: string): Promise<DraftSeedling | null> => {
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a gardening assistant. Extract seedling/plant information from the following seed packet text and return ONLY a valid JSON object with no markdown formatting.

Use these exact values where applicable:
- type: one of ["Herb", "Vegetable", "Leafy Green", "Flower", "Fruit", "Root Vegetable", "Lettuce", "Other"]
- whereToStart: one of ["Indoors", "Outdoors", "Both"]
- season: one of ["Warm", "Cool", "Cool to Warm"]
- frostTolerance: true or false

JSON fields to populate:
{
  "variety": "",
  "type": "",
  "emoji": "",
  "whereToStart": "",
  "whenToStart": "",
  "soilTemperatureForGermination": "",
  "spacing": "",
  "depth": "",
  "daysToGerminate": "",
  "wateringFrequency": "",
  "season": "",
  "frostTolerance": null,
  "height": "",
  "daysToHarvest": "",
  "soilAcidity": ""
}

Seed packet text:
${text}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim().replace(/^```json\n?|```$/g, '');
    return JSON.parse(responseText) as DraftSeedling;
  };

  // ── Vision API ───────────────────────────────────────────────────────────

  const analyzeImage = async (base64: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
        {
          requests: [
            {
              image: { content: base64 },
              features: [{ type: 'DOCUMENT_TEXT_DETECTION', maxResults: 1 }],
            },
          ],
        },
      );

      const annotation = response.data.responses?.[0];
      if (annotation?.fullTextAnnotation) {
        const fullText: string =
          annotation.textAnnotations?.[0]?.description ?? annotation.fullTextAnnotation.text;

        if (onSeedlingExtracted) {
          const draft = await extractSeedlingFromText(fullText);
          if (draft) onSeedlingExtracted(draft);
        }
      } else {
        setError('No text found in image.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during text detection.');
    } finally {
      setLoading(false);
    }
  };

  // ── Image sources ────────────────────────────────────────────────────────

  const pickFromCamera = async () => {
    const permission = await ExpoImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Camera access is required to take a photo.');
      return;
    }

    const result = await ExpoImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      analyzeImage(result.assets[0].base64);
    }
  };

  const pickFromLibrary = async () => {
    const permission = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      analyzeImage(result.assets[0].base64);
    }
  };

  // ── Entry point ──────────────────────────────────────────────────────────

  const handleScanPress = () => {
    Alert.alert(
      'Scan Seedling Packet',
      'How would you like to provide the image?',
      [
        { text: '📷 Take Photo', onPress: pickFromCamera },
        { text: '🖼 Choose from Library', onPress: pickFromLibrary },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.scanButton, loading && styles.scanButtonDisabled]}
        onPress={handleScanPress}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.scanButtonText}>📷 Scan Seedling Packet</Text>
        )}
      </TouchableOpacity>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 220,
  },
  scanButtonDisabled: {
    opacity: 0.6,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginTop: 8,
    fontSize: 13,
  },
});

export default SeedPacketPicker;
