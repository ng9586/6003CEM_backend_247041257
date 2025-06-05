import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 定義 uploads 資料夾絕對路徑
const uploadDir = path.join(__dirname, '../../uploads');

// 如果 uploads 資料夾不存在，則建立
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // 用時間戳 + 原始檔名，避免檔名衝突
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    // 只接受 jpg/jpeg/png 格式
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      cb(null, true);
    } else {
      cb(new Error('只接受 JPG/PNG 圖片'));
    }
  }
});
