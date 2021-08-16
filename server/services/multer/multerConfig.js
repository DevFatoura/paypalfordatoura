import multer from 'multer';

exports.storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        console.log(file)
        var name = file.originalname ? file.originalname.replace(/\s+/g, '_') : file.originalname;
        cb(null,`${Date.now()}-${name}`);
    }
});