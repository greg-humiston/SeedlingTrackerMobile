// import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";

import * as ImagePicker from 'expo-image-picker';

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY;

type Base64<imageType extends string> = `data:image/${imageType};base64${string}`;

// ----------------- expo image picker usage -----------------
const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    base64: true, // Crucial for sending to API
    quality: 0.5, // Optimize size
  });

  if (!result.canceled) {
    return result.assets[0]; // Returns {uri, base64, ...}
  }
};

// ----------------- gemini vision api usage -----------------
// const genAI = new GoogleGenerativeAI("YOUR_API_KEY");
const genAI = new GoogleGenAI({apiKey: GOOGLE_API_KEY!});

// TODO: confirm the abstract type passed to Base64 is correct for the image picker output
async function analyzeImage(base64Data: any) {
  const prompt = "Describe this image in detail.";

  // const response = await genAI.models.generateContent({
  //   model: "gemini-3.7-flash",
  //   contents: prompt,
  // });

  const interaction = await genAI.interactions.create({
    model: "gemini-3.7-flash",
    input: [
        {type: "text", text: prompt},
        {
            type: "image",
            uri: base64Data,
            mime_type: "image/jpeg"
        }
    ]
});

  // const result = await model.generateContent([prompt, imagePart]);
  // const response = await result.response;
 	return interaction;
}

// hook implementation
export const usePickImage = () => {
	const pick = async () => {
		try {
			// const analyzedImage = analyzeImage(await pickImage());
			// console.log('Analyzed image response:', analyzedImage);
			// return analyzeImage(await pickImage());
		} catch (error) {
			console.error('Error picking image:', error);
		}
	};

	return { pick };
};

export default usePickImage;