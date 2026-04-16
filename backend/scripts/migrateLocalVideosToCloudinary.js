require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs = require('fs');
const path = require('path');
const { uploadVideoBuffer, isCloudinaryConfigured } = require('../utils/cloudinaryUpload');

const uploadsDir = path.join(__dirname, '..', 'uploads', 'videos');

async function main() {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary env vars are missing in backend/.env');
  }

  if (!fs.existsSync(uploadsDir)) {
    console.log('No uploads/videos directory found. Nothing to migrate.');
    return;
  }

  const files = fs
    .readdirSync(uploadsDir)
    .filter((file) => fs.statSync(path.join(uploadsDir, file)).isFile());

  if (files.length === 0) {
    console.log('No local video files found. Nothing to migrate.');
    return;
  }

  console.log(`Found ${files.length} local video file(s) to upload.`);

  const results = [];

  for (const file of files) {
    const absolutePath = path.join(uploadsDir, file);
    const buffer = fs.readFileSync(absolutePath);
    const ext = path.extname(file) || '.webm';
    const publicId = path.basename(file, ext);

    console.log(`Uploading ${file}...`);

    const uploaded = await uploadVideoBuffer(buffer, {
      fileName: file,
      mimeType: ext.toLowerCase() === '.mp4' ? 'video/mp4' : 'video/webm',
      folder: 'eraai/round3-videos/migrated',
      publicId,
    });

    results.push({
      file,
      localPath: absolutePath,
      cloudinaryUrl: uploaded.secure_url || uploaded.url,
      publicId: uploaded.public_id,
      bytes: uploaded.bytes,
    });
  }

  console.log('\nMigration complete.\n');
  for (const item of results) {
    console.log(`File: ${item.file}`);
    console.log(`Local: ${item.localPath}`);
    console.log(`Cloudinary URL: ${item.cloudinaryUrl}`);
    console.log(`Public ID: ${item.publicId}`);
    console.log(`Bytes: ${item.bytes}`);
    console.log('');
  }

  console.log('Local files were not deleted. Remove them only after you verify the Cloudinary URLs.');
}

main().catch((error) => {
  console.error('Video migration failed:', error.message);
  process.exit(1);
});
