// Dịch vụ upload ảnh lên Cloudinary với cơ chế fallback thông minh (Base64)

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'gin1ykc1';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'lovespace_preset';

/**
 * Tải ảnh trực tiếp lên Cloudinary (Unsigned upload)
 * Nếu chưa tạo preset trên Cloudinary hoặc lỗi mạng, tự động chuyển về Base64 Data URL để không làm gián đoạn trải nghiệm người dùng
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (!CLOUD_NAME) {
    return fileToBase64(file);
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'lovespace');

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      console.warn('Cloudinary upload response not OK, fallback to base64:', await res.text());
      return fileToBase64(file);
    }

    const data = await res.json();
    return data.secure_url || data.url || (await fileToBase64(file));
  } catch (error) {
    console.warn('Cloudinary upload failed, falling back to local base64:', error);
    return fileToBase64(file);
  }
}

/**
 * Chuyển File thành chuỗi Base64 Data URL
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
