// const PORT = require ("../config/db")
const express = require('express');
const router = express.Router()
const userController = require('../controller/controller');
const multer = require('multer');
const fs = require("fs");
const app=express()

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = 'uploads/profile';
        if (!fs.existsSync("uploads")) {
            fs.mkdirSync(dir);
            cb(null, dir)
        }
        if (fs.existsSync(dir)) {
            cb(null, dir)
        } else {
            fs.mkdirSync(dir);
            cb(null, dir)
        }
    },
    filename: function (req, file, cb) {
        var file_ext = file.originalname.split('.').pop();
        var file_name = file.originalname.replace("." + file_ext, "").replace(/[-&\/\\#,+()$~%.'":*?<>{} ]/g, '_');
        file_name = file_name + (new Date().getTime());
        cb(null, file_name + '.' + file_ext) //Appending extension
    }
    // new Date().getTime() + '_' +
})

const upload = multer({
    storage: storage
});

router.get('/:user_id', userController.findById);

router.post("/getAll", userController.findAll);
router.post('/', upload.fields([{ name: 'user_image', maxCount: 10 }]), userController.create);


router.put("/:id", upload.fields([{ name: 'user_image', maxCount: 10 }]), userController.update);

router.delete('/:user_id', userController.delete)
router.delete('/', userController.delete)

module.exports = router




