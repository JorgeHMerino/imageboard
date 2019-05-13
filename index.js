//SERVER
const express = require("express");
const app = express();
const s3 = require("./s3");
const db = require("./db");
//
app.use(express.static("./public"));
//
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
//
const bodyParser = require("body-parser");
app.use(bodyParser.json());
// DISK STORAGE
var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});
// UPLOADER
var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 5000000
    }
});
//
app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    console.log("req.file", req.file);
    console.log(
        "URL from Amazon",
        req.file.filename,
        req.body.title,
        req.body.description,
        req.body.username
    );
    if (req.file) {
        var urlConc =
            "https://s3.amazonaws.com/spicedling/" + req.file.filename;
        console.log("pic", urlConc);
        db.insertImages(
            urlConc,
            req.body.username,
            req.body.title,
            req.body.description
        )
            .then(results => {
                res.json(results.rows);
            })
            .catch(error => {
                console.log(error);
            });
    }
});
//
app.get("/getimages", (req, res) => {
    db.getAllImages()
        .then(results => {
            res.json(results.rows);
        })
        .catch(error => {
            console.log(error);
        });
});
//
app.get("/images/:id", (req, res) => {
    console.log("existing /images/:id");
    let id = req.params.id;
    db.getImageId(id)
        .then(results => {
            res.json(results.rows);
        })
        .catch(error => {
            console.log(error);
        });
});

app.listen(8080, () => console.log("Platform listening!"));
