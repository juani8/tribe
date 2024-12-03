import { Platform } from 'react-native';

const uploadToCloudinary = async (fileUri, mediaType) => {
    const data = new FormData();
    data.append('file', {
        uri: Platform.OS === 'android' ? fileUri : fileUri.replace('file://', ''),
        type: mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
        name: fileUri.split('/').pop()
    });
    data.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET); 

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`, {
            method: 'POST',
            body: data
        });
        const result = await response.json();
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};

export default uploadToCloudinary;