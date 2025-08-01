Getting Started 
Follow these instructions to get a local copy of DocAI up and running on your system. Even if you're not a 
developer, these steps should guide you through the process. 
 
Prerequisites 
You'll need to install a few free tools before you begin. These are standard tools for software development. 
 
• Git: A tool for downloading code from online repositories like GitHub. 
• Node.js & npm: A JavaScript runtime and package manager. Think of it as an engine for running the 
authentication backend and the user interface. 
• Java (JDK) & Maven: A programming language and build tool, used to run the main AI processing 
backend. 
Installation & Setup 
1. Clone the Project Code Open your terminal or command prompt and run this command. This will 
download a copy of the project to your computer. 
 
git clone “https://github.com/Vedant-1509/documentai” 
cd documentai 
 
2. Understand the Branch Structure 
     All services are organized within a single branch (main) for simplified development and 
deployment: 
• restapi/: Contains the Spring Boot Processing Backend (the AI brain) 
• backend/: Contains the Node.js Authentication Backend 
• frontend/: Contains the React Frontend 
3. Setup the Processing Rest Api Backend (Spring Boot) This service runs on port 8080 
 
o You need to provide API keys in src/main/resources/application.properties. This is a 
configuration file where you store secret keys. Create the file if it doesn't exist and add the 
following, replacing the placeholders with your actual keys from Cohere and Pinecone. 
 
Properties 
#Server 
Port server.port=8080 
#PineconeConfiguration 
pinecone.api.key=YOUR_PINECONE_API_KEY 
pinecone.index.url=YOUR_PINECONE_INDEX_URL 
#Cohere Configuration 
cohere.api.key=YOUR_COHERE_API_KEY 
cohere.embedding.endpoint=https://api.cohere.ai/v1/embed 
 
• Now, run the server. You should see a lot of text in your terminal, ending with a message that the  
• server has started on port 8080. 
 
./ mvnw spring-boot:run 
 
 
3. Setup the  Backend & Frontend (Node.js & React) Open a new terminal window for this part, so 
the other backend can keep running. 
 
 
o Setup the  Backend (Node.js): This service runs on port 5000. 
▪ Navigate to the backend folder: cd backend 
▪ Install all necessary packages: npm install 
▪ Create a file named .env in the /backend folder. This is another file for secret keys. Add 
the following, filling in your details. 
 
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING 
PORT=5000 
JWT_SECRET=CREATE_A_RANDOM_SECRET_KEY_HERE 
 
▪ Start the backend server. You should see a message like "Server running on port 5000". 
 
                   npm start 
 
o Setup the Frontend (React): Open a third terminal window. This service runs on port 
 
3000. 
 
▪ Navigate to the frontend folder from the project's root directory: cd frontend 
▪ Install all necessary packages: npm install 
▪ Run the frontend application. This should automatically open a new tab in your web 
browser at http://localhost:3000. 
npm start 
 
At this point, you should have all three services running in separate terminals, and you can use 
the application in your browser!