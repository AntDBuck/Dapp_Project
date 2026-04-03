import imageCompression from "browser-image-compression";

export const formatTime = ((timestamp) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString();
});

export const formatAddress = ((address) => {
    const formattedAddress = address.slice(0, 5) + '...' + address.slice(-3);
    return formattedAddress;
});

export const generateId = () => {
    const datePart = Date.now().toString(); 
    const randomNumberPart = Math.floor(Math.random() * 1000000000).toString();
    const newId = (datePart + '-' + randomNumberPart);
    return newId;
};

export const imgCompressAndBase64Convert = async (imgFile) => {
    const compressedImg = await imageCompression(imgFile, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 720,
        useWebWorker: true,
        fileType: 'image/webp'
    });

    const base64Img = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(compressedImg);
    });

    return base64Img;
};

export const titleValidator = (articleTitle) => {
    return articleTitle.replace(/[^A-Za-z0-9 ]/g, '');
};