pipeline {
    agent any

    tools {
        nodejs '20' // NOTE: Ensure you have "20" configured in Jenkins Global Tool Configuration
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Backend') {
            steps {
                dir('backend') {
                    sh 'npm install --no-audit --no-fund'
                }
            }
        }

        stage('Install & Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install --no-audit --no-fund'
                    // The frontend now dynamically determines the backend IP (bypassing the need for VITE_ env vars)
                    sh 'export NODE_OPTIONS="--max-old-space-size=512" && npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                // Stop PM2 process first
                sh '''
                    sudo -u gowtham bash -c "pm2 delete doc-verify-backend 2>/dev/null || true"
                    sudo -u gowtham bash -c "pm2 kill 2>/dev/null || true"
                '''

                // Sync files locally (without deleting uploads or .env inside the web folder)
                sh '''
                    sudo mkdir -p /var/www/document-approval/backend
                    sudo mkdir -p /var/www/document-approval/frontend
                    sudo mkdir -p /var/www/document-approval/backend/uploads

                    # Sync Backend
                    sudo rsync -a --delete --exclude='uploads' --exclude='.env' --exclude='node_modules' backend/ /var/www/document-approval/backend/
                    # Sync Frontend (Only the built static files)
                    sudo rsync -a --delete frontend/dist/ /var/www/document-approval/frontend/

                    # Copy node_modules over
                    cd backend && sudo cp -r node_modules /var/www/document-approval/backend/ 2>/dev/null || true
                    cd ..

                    # Ensure .env exists in backend (Assuming you created a global .env file in /var/www/document-approval/.env)
                    sudo cp /var/www/document-approval/.env /var/www/document-approval/backend/.env 2>/dev/null || true

                    # Change permissions to the target user (gowtham)
                    sudo chown -R gowtham:gowtham /var/www/document-approval
                '''

                // Start PM2 fresh as the target user
                sh '''
                    sudo -u gowtham bash -c "cd /var/www/document-approval/backend && pm2 start server.js --name doc-verify-backend && pm2 save"
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed.'
        }
    }
}
