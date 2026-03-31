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
                    sh 'npm install'
                }
            }
        }

        stage('Frontend: Install Dependencies & Build') {
            steps {
                dir('frontend') {
                    echo 'Installing Frontend Dependencies...'
                    sh 'npm install'
                    echo 'Building React App...'
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy to Azure VM') {
            steps {
                echo 'Deploying application to Azure VM...'
                
                // Transfer Backend files (Replace 'azureuser@your_azure_vm_ip' with your actual VM user and IP)
                sh """
                scp -o StrictHostKeyChecking=no backend/package.json backend/server.js azureuser@your_azure_vm_ip:/var/www/document-approval/backend/
                scp -r -o StrictHostKeyChecking=no backend/routes backend/config backend/middleware backend/models backend/controllers azureuser@your_azure_vm_ip:/var/www/document-approval/backend/
                """
                
                // Transfer Frontend build files
                sh """
                scp -r -o StrictHostKeyChecking=no frontend/dist/* azureuser@your_azure_vm_ip:/var/www/document-approval/frontend/
                """

                // Connect via SSH to install backend production dependencies & restart PM2
                sh """
                ssh -o StrictHostKeyChecking=no azureuser@your_azure_vm_ip "cd /var/www/document-approval/backend && npm install --omit=dev && pm2 restart server || pm2 start server.js --name 'doc-verify-backend'"
                """
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
