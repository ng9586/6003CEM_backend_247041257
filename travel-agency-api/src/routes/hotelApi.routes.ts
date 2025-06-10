import express from 'express';
import {
  getSurroundingHotels,
  getRoomList,
  getRoomListPhoto,
  autocompleteHotels,
} from '../controllers/hotelApi.controller';

const router = express.Router();

// 取得周邊飯店
router.get('/surrounding-hotels', getSurroundingHotels);

// 取得飯店房型列表
router.get('/room-list', getRoomList);

// 取得房型照片
router.get('/room-list-photo', getRoomListPhoto);

// 飯店自動完成搜尋
router.get('/autocomplete', autocompleteHotels);

export default router;
