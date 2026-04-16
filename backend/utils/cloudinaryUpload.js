const crypto = require('crypto');

function getCloudinaryConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  };
}

function isCloudinaryConfigured() {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  return Boolean(cloudName && apiKey && apiSecret);
}

function signUploadParams(params, apiSecret) {
  const serialized = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return crypto
    .createHash('sha1')
    .update(`${serialized}${apiSecret}`)
    .digest('hex');
}

async function uploadVideoBuffer(buffer, options = {}) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = options.folder || 'eraai/round3-videos';
  const publicId = options.publicId;
  const uploadParams = { folder, timestamp };
  if (publicId) uploadParams.public_id = publicId;

  const form = new FormData();
  form.append('file', new Blob([buffer], { type: options.mimeType || 'video/webm' }), options.fileName || 'recording.webm');
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  if (publicId) form.append('public_id', publicId);
  form.append('signature', signUploadParams(uploadParams, apiSecret));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
    method: 'POST',
    body: form,
  });

  const payload = await response.json();
  if (!response.ok) {
    const message = payload?.error?.message || 'Cloudinary upload failed';
    throw new Error(message);
  }

  return payload;
}

module.exports = {
  isCloudinaryConfigured,
  uploadVideoBuffer,
};
