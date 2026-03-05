import axios from 'axios';
import * as ExpoImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Alert, Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const GOOGLE_CLOUD_VISION_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY;

export function ImagePicker() {
  const [image, setImage] = useState<string | null | undefined>(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

	// TODO: is this different at all due to needing a base64 encoded image?
	const analyzeImage = async (uri: any) => {
		setLoading(true);
		setExtractedText('');
		try {
			// Read the image file and convert it to base64
			// const base64imageTest = await FileSystem.readAsStringAsync(uri, {
			// 	encoding: FileSystem.EncodingType.Base64,
			// });

			// const base64image = await new FileSystem.File(uri).base64();
			// console.log('base64image:', base64image);

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
				`https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`, 
				requestData
			);

			if (response.data.responses && response.data.responses[0].fullTextAnnotation) {
				const text = response.data.responses[0].fullTextAnnotation.text;
				setExtractedText(text);
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
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {
				image && 
				// TODO: figure out if base64 encoding is actually working here
				<Image source={{ uri: 'data:image/jpeg;base64,' + image }} style={styles.image} />
			}
			{loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {extractedText ? (
        <ScrollView style={styles.textContainer}>
          <Text style={styles.text}>{extractedText}</Text>
        </ScrollView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
	container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
    resizeMode: 'contain',
  },
  textContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 200,
    width: '100%',
  },
  text: {
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default ImagePicker;