import multer from "multer";
import AppError from "../utils/AppError.js";

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500 MB

const storage = multer.memoryStorage();

const videoFileFilter = (req, file, cb) => {
    if (!ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
        return cb(
            new AppError(
                "Invalid video format. Allowed formats: MP4, WebM, MOV",
                400
            )
        );
    }
    cb(null, true);
};

export const uploadVideo = multer({
    storage,
    fileFilter: videoFileFilter,
    limits: { fileSize: MAX_VIDEO_SIZE },
}).single("video");