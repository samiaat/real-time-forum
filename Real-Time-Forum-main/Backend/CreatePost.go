package forum

import (
	"log"
	"net/http"
	"strings"
)

func CreatePostHandler(w http.ResponseWriter, r *http.Request) {

	if r.URL.Path != "/CreatePost" {
		http.Error(w, "Page Not Found", 404)
		return
	}

	var user Account
	user = GetUserData(w, r)
	if r.Method == "POST" {
		err := r.ParseMultipartForm(10 << 20)
		if err != nil {
			http.Error(w, "Error parsing form data", http.StatusBadRequest)
			return
		}

		imgPath := ""

		title := r.FormValue("Title")
		content := r.FormValue("Content")
		checkboxes := r.Form["checkbox"]

		InsertPost(user.Id, user.Username, user.ProfileImg, title, content, imgPath, strings.Join(checkboxes, ","), 0, 0)

	} else {
		HomeData = HomeTemplateData{
			Username:   user.Username,
			ProfileImg: user.ProfileImg,
		}
		Template(w)
	}

}
func InsertPost(userID int, username string, userImg string, title string, content string, image string, category string, like int, dislike int) {
	query := `
        INSERT INTO posts (user_id, username,userImg,title,content, image,category, like, dislike)
        VALUES (?, ?, ?, ?, ?,?,?,?,?)
    `

	_, err := Postsdb.Exec(query, userID, username, userImg, title, content, image, category, like, dislike)
	if err != nil {
		log.Fatal(err)
	}
}
