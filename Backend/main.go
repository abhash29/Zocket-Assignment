package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// MongoDB Setup
var client *mongo.Client
var userCollection *mongo.Collection

// JWT Secret Key
var jwtSecret = []byte("ZOCKET")

// Task Model
type Task struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description" json:"description"`
	Deadline    string             `bson:"deadline" json:"deadline"`
	Completed   bool               `bson:"completed" json:"completed"`
	Priority    string             `bson:"priority" json:"priority"` // "Low", "Medium", "High"
}

// User Model
type User struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Username string             `bson:"username" json:"username"`
	Password string             `bson:"password" json:"password"`
	Tasks    []Task             `bson:"tasks" json:"tasks"` // ✅ Each user has an array of tasks (Initially Empty)
	Token    string             `bson:"token,omitempty" json:"token,omitempty"`
}

// JWT Claims
type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// ✅ Generate JWT Token
func generateJwt(user User) (string, error) {
	expirationTime := time.Now().Add(1 * time.Hour) // 🔹 Expires in 1 hour
	claims := &Claims{
		Username: user.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func main() {
	// ✅ Connect to MongoDB
	clientOptions := options.Client().ApplyURI("mongodb+srv://abhashkumardas29:Abhash29@authentication.1vp14.mongodb.net/Courses")
	var err error
	client, err = mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	userCollection = client.Database("Courses").Collection("users")

	// ✅ Gin Router Setup
	r := gin.Default()

	// ✅ Enable CORS Middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Change this to your frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// ✅ Public Routes
	r.POST("/signup", signup)        // 🔹 User signup
	r.POST("/login", login)          // 🔹 User login
	// r.GET("/users", getUsers)        // 🔹 List all users
	// r.GET("/users/:id/tasks", getUserTasks) // 🔹 Get tasks for a specific user
	// r.POST("/users/:id/tasks", addTask)     // 🔹 Add a task for a specific user

	// ✅ Start Server
	log.Println("Server running on port 5000...")
	r.Run(":5000")
}

// ✅ User Signup Route
func signup(c *gin.Context) {
	var user User
	if c.ShouldBindJSON(&user) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	if userCollection.FindOne(context.TODO(), bson.M{"username": user.Username}).Err() == nil {
		c.JSON(http.StatusConflict, gin.H{"message": "User already exists"})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hashedPassword)
	user.ID = primitive.NewObjectID()
	user.Tasks = []Task{} // ✅ Initialize the task array as empty

	if _, err := userCollection.InsertOne(context.TODO(), user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error saving user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Signup successful"})
}

// ✅ User Login Route
func login(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}
}


// ✅ Get Tasks for a User
func getUserTasks(c *gin.Context) {
	username := c.Query("username") // Get username from query params

	var user User
	err := userCollection.FindOne(context.TODO(), bson.M{"username": username}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user.Tasks)
}

