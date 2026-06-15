const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public', 'images');

function getAllImages(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllImages(filePath));
    } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
      results.push(filePath);
    }
  });
  return results;
}

async function compressAll() {
  const images = getAllImages(publicDir);
  console.log(`Found ${images.length} images to compress...`);
  
  let totalBefore = 0;
  let totalAfter = 0;

  for (const imgPath of images) {
    const before = fs.statSync(imgPath).size;
    totalBefore += before;
    
    const tmpPath = imgPath + '.tmp';
    
    try {
      await sharp(imgPath)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 75 })
        .toFile(tmpPath.replace(/\.(png|jpg|jpeg)$/i, '.tmp.jpg'));
      
      // Replace original with compressed version
      const compressedPath = tmpPath.replace('.tmp', '').replace(/\.(png|jpg|jpeg)$/i, '.jpg');
      
      if (imgPath.toLowerCase().endsWith('.png') && compressedPath !== imgPath) {
        // For PNG -> JPG conversion, rename
        fs.renameSync(tmpPath.replace(/\.(png|jpg|jpeg)$/i, '.tmp.jpg'), imgPath.replace(/\.png$/i, '.jpg'));
        fs.unlinkSync(imgPath);
      } else {
        fs.renameSync(tmpPath.replace(/\.(png|jpg|jpeg)$/i, '.tmp.jpg'), imgPath);
      }
      
      const newPath = imgPath.replace(/\.png$/i, '.jpg');
      const after = fs.existsSync(newPath) ? fs.statSync(newPath).size : fs.statSync(imgPath).size;
      totalAfter += after;
      
      const saved = (((before - after) / before) * 100).toFixed(0);
      console.log(`✓ ${path.basename(imgPath)} → ${saved}% smaller`);
    } catch (err) {
      console.error(`✗ Failed: ${path.basename(imgPath)} - ${err.message}`);
      // Clean up temp file if exists
      const tmpJpg = tmpPath.replace(/\.(png|jpg|jpeg)$/i, '.tmp.jpg');
      if (fs.existsSync(tmpJpg)) fs.unlinkSync(tmpJpg);
    }
  }
  
  const totalSavedMB = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(1);
  const beforeMB = (totalBefore / 1024 / 1024).toFixed(1);
  const afterMB = (totalAfter / 1024 / 1024).toFixed(1);
  console.log(`\n✅ Done! ${beforeMB}MB → ${afterMB}MB (saved ${totalSavedMB}MB)`);
}

compressAll().catch(console.error);
