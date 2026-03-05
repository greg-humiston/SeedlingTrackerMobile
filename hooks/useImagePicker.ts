import { GoogleGenerativeAI } from "@google/generative-ai";
import * as ImagePicker from 'expo-image-picker';

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
const genAI = new GoogleGenerativeAI("YOUR_API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// TODO: confirm the abstract type passed to Base64 is correct for the image picker output
async function analyzeImage(base64Data: any) {
  const prompt = "Describe this image in detail.";
  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: "image/jpeg"
    },
  };

  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
 	return response;
}

// hook implementation
export const usePickImage = () => {
	const pick = async () => {
		try {
			const analyzedImage = analyzeImage(await pickImage());
			console.log('Analyzed image response:', analyzedImage);
			return await pickImage();
		} catch (error) {
			console.error('Error picking image:', error);
		}
	};

	return { pick };
};

export default usePickImage;