(function() {
    Vue.component("image-modal", {
        template: "#myPopUp",
        props: ["id"],
        data: function() {
            return {
                imagePopup: {},
                form: {
                    comment: "",
                    username: ""
                },
                comments: []
            };
        },
        mounted: function() {
            const album = this;
            console.log(this.id);
            axios.get("/images/" + this.id).then(function(results) {
                console.log("results: ", results);
                album.imagePopup = results.data[0];
                console.log(results.data);
            });
            axios.get("/comments/" + this.id).then(function(results) {
                album.comments = results.data.rows.reverse();
            });
        },
        methods: {
            closeNow: function() {
                this.$emit("close");
            },
            addComment: function(e) {
                e.preventDefault();
                const album = this;
                axios
                    .post("/addComment", {
                        comment: album.form.comment,
                        username: album.form.username,
                        id: album.id
                    })
                    .then(function(results) {
                        console.log(results.data.rows[0]);
                        album.comments.unshift(results.data.rows[0]);
                    });
            }
        }
    });
    new Vue({
        el: "#main",
        data: {
            images: [],
            currentImage: null,
            form: {
                title: "",
                username: "",
                description: "",
                file: null
            }
        },
        mounted: function() {
            var self = this;
            axios
                .get("/getimages")
                .then(function(resp) {
                    self.images = resp.data;
                    console.log("response from server", resp.data);
                    console.log("SELF in then of axios: ", this);
                })
                .catch(function(err) {
                    console.log("err: ", err);
                });
        },
        methods: {
            handleFileChange: function(e) {
                console.log("data from e ", e);
                this.form.file = e.target.files[0];
                console.log("this: ", this);
            },
            uploadFile: function(e) {
                e.preventDefault();
                console.log("upload file running!");
                console.log("this is uploadFile");
                var formData = new FormData();
                var self = this;
                formData.append("file", this.form.file);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);
                axios.post("/upload", formData).then(data => {
                    self.images.unshift(data.data[0]);
                });
            },
            setCurrentImage: function(imgId) {
                this.currentImage = imgId;
            },
            closeModal: function() {
                console.log(this.id);
                this.currentImage = null;
            }
        }
    });
})();
