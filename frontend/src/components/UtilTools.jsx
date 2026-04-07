import imageCompression from "browser-image-compression";

/**
 * Converts timestap into human-readable date and time.
 * @param {number} timestamp Timestamp to be converted.
 * @returns {string} The formatted date as a string.
 */
export const formatTime = ((timestamp) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString();
});

/**
 * Shorten address by slicing middle section.
 * @param {string} address The hexidecimal string representing user's account.
 * @returns {string} The shortened address.
 */
export const formatAddress = ((address) => {
    const formattedAddress = address.slice(0, 5) + '...' + address.slice(-3);
    return formattedAddress;
});

/**
 * Generate a unique ID by combining date at activation and a random number up to 1 billion.
 * @returns {string} The new ID.
 */
export const generateId = () => {
    const datePart = Date.now().toString(); 
    const randomNumberPart = Math.floor(Math.random() * 1000000000).toString();
    const newId = (datePart + '-' + randomNumberPart);
    return newId;
};

/**
 * Compress image, convert to WebP, and then convert to Base64.
 * @param {File} imgFile The image to compress and convert.
 * @returns {Promise} The Base64 representation of the image.
 */
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

/**
 * Removes and prevents all unwanted characters from an article title.
 * @param {string} articleTitle The inputted article title. 
 * @returns {string} The Validated article title.
 */
export const titleValidator = (articleTitle) => {
    return articleTitle.replace(/[^A-Za-z0-9 ]/g, '');
};