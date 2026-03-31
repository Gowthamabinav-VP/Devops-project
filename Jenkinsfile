pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        MONGO_URI = credentials('MONGO_URI')
        JWT_SECRET = credentials('JWT_SECRET')
        // NEW DEPLOYMENT ENV VARS
        VM_IP = 'your_azure_vm_ip' // Update with your actual Azure VM IP Address
        VM_USER = 'azureuser'      // Update with your Azure VM SSH Username
        SSH_KEY = credentials('azure_vm_ssh_key') // Create this 'Secret file' credential in Jenkins containing your Azure SSH Private Key
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

        stage('Deploy to Azure VM') {
            steps {
                echo 'Deploying application to Azure VM...'
                
                // 1. Transfer Backend files
                bat """
                scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no backend/package.json backend/server.js %VM_USER%@%VM_IP%:/var/www/document-approval/backend/
                scp -r -i "%SSH_KEY%" -o StrictHostKeyChecking=no backend/routes backend/config backend/middleware backend/models backend/controllers %VM_USER%@%VM_IP%:/var/www/document-approval/backend/
                """
                
                // 2. Transfer Frontend build files (Vite uses 'dist' folder)
                bat """
                scp -r -i "%SSH_KEY%" -o StrictHostKeyChecking=no frontend/dist/* %VM_USER%@%VM_IP%:/var/www/document-approval/frontend/
                """

                // 3. Connect via SSH to install backend production dependencies & restart PM2
                bat """
                ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %VM_USER%@%VM_IP% "cd /var/www/document-approval/backend && npm install --omit=dev && pm2 restart server || pm2 start server.js --name 'doc-verify-backend'"
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
