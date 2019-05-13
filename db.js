var spicedPg = require("spiced-pg");

var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:jorgehuertamerino:password@localhost:5432/pixels"
);
//
module.exports.getAllImages = function getAllImages() {
    return db.query("SELECT * FROM images ORDER BY id DESC");
};
//
module.exports.insertImages = function insertImages(
    url,
    username,
    title,
    description
) {
    return db.query(
        "INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING * ",
        [url, username, title, description]
    );
};

module.exports.getImageId = function getImageId(id) {
    return db.query("SELECT * FROM images WHERE id= $1", [id]);
};
