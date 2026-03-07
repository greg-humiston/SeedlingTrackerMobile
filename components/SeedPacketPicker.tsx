import type { DraftSeedling } from '@/types/home';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import * as ExpoImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Alert, Button, Image, StyleSheet, Text, View } from 'react-native';

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY;

type Props = {
  onSeedlingExtracted?: (draft: DraftSeedling) => void;
};

export function SeedPacketPicker({ onSeedlingExtracted }: Props) {
  const [image, setImage] = useState<string | null | undefined>(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

	// TODO: is this different at all due to needing a base64 encoded image?
	const analyzeImage = async (uri: any) => {
		setLoading(true);
		setExtractedText('');
		try {
			const requestData = {
				requests: [
					{
						image: {
							content: uri,
						},
						features: [
							{
								type: 'DOCUMENT_TEXT_DETECTION', // Use DOCUMENT_TEXT_DETECTION for dense text/documents
								maxResults: 1,
							},
						],
					},
				],
			};

			const response = await axios.post(
				`https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
				requestData
			);

			if (response.data.responses && response.data.responses[0].fullTextAnnotation) {
				const fullText: string = response.data.responses[0].textAnnotations?.[0]?.description
					?? response.data.responses[0].fullTextAnnotation.text;
				setExtractedText(fullText);

				if (onSeedlingExtracted) {
					const draft = await extractSeedlingFromText(fullText);
					if (draft) {
            onSeedlingExtracted(draft);
            console.log(draft);
            setExtractedText(JSON.stringify(draft, null, 2));
          }
				}
			} else {
				setExtractedText('No text found or unable to analyze.');
			}

		} catch (error) {
			console.error(error);
			setExtractedText('An error occurred during text detection.');
		} finally {
			setLoading(false);
		}
	};

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library.
    // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
    // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
    // so the app users aren't surprised by a system dialog after picking a video.
    // See "Invoke permissions for videos" sub section for more details.
    const permissionResult = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true, // Crucial for sending to API
    });

    console.log(result);

    if (!result.canceled) {
			analyzeImage(result.assets[0].base64);
      setImage(result.assets[0].base64);
    }
  };

  return (
    <View>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonContainer}>
          <Button title="Scan Seedling Packet" onPress={pickImage} />
        </View>
      </View>
      {
				image && 
				// TODO: figure out if base64 encoding is actually working here
				<Image source={{ uri: 'data:image/jpeg;base64,' + image }} style={styles.image} />
			}
			{loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
    resizeMode: 'contain',
  },
  buttonContainer: {
    marginVertical: 10,
    width: 200,
    height: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  extractedTextContaine: {
    height: 500,
    backgroundColor: '#f0f0f0',
  },
  textContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    height: 500,
    width: '100%',
    overflow: 'scroll',
  },
  text: {
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default SeedPacketPicker;