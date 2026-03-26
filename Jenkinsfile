pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        MONGO_URI = credentials('MONGO_URI')
        JWT_SECRET = credentials('JWT_SECRET')
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source control...'
                checkout scm
            }
        }

        stage('Backend: Install Dependencies') {
            steps {
                dir('backend') {
                    echo 'Installing Backend Dependencies...'
                    bat 'npm install'
                }
            }
        }

        stage('Frontend: Install Dependencies & Build') {
            steps {
                dir('frontend') {
                    echo 'Installing Frontend Dependencies...'
                    bat 'npm install'
                    echo 'Building React App...'
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                // This is a sample deployment step.
                // In a real environment, you might copy files to a web server (like Nginx),
                // or use PM2 to restart the Node.js backend.
                dir('backend') {
                    // Assuming PM2 is installed globally on the Jenkins node
                    bat 'npm rebuild'
                    // Uncomment the next line to actually restart with PM2
                    // bat 'pm2 restart server.js || pm2 start server.js --name "doc-verify-backend"'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
