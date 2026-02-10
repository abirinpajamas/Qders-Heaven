// File upload utility functions
import imageCompression from 'browser-image-compression';
export const handleFileChange = (event, setFile) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file size (max 5MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      event.target.value = ''; // Clear input
      return;
    }
    
    // Validate file type for images
    if (file.type.startsWith('image/') && !file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
      alert('Only JPEG, PNG, GIF, and WebP images are allowed');
      event.target.value = '';
      return;
    }
    
    setFile(file);
  }
};

export const createFormData = (data, files = {}) => {
  const formData = new FormData();
  
  // Add all text data
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  // Add files
  Object.keys(files).forEach(key => {
    if (files[key]) {
      formData.append(key, files[key]);
    }
  });
  
  return formData;
};
