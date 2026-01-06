pipeline {
    agent { label 'docker-agent' }

    environment {
        DOCKER_HUB_USER = 'garcia123'
        BACKEND_IMAGE = "${DOCKER_HUB_USER}/task-logger-backend:${BUILD_NUMBER}"
        FRONTEND_IMAGE = "${DOCKER_HUB_USER}/task-logger-frontend:${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh "docker build -t ${BACKEND_IMAGE} -t ${DOCKER_HUB_USER}/task-logger-backend:latest ."
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh "docker build -t ${FRONTEND_IMAGE} -t ${DOCKER_HUB_USER}/task-logger-frontend:latest ."
                }
            }
        }

        stage('Test Backend') {
            steps {
                sh "docker run --rm ${BACKEND_IMAGE} npm test"
            }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    sh "docker run --rm -v ${WORKSPACE}/frontend:/app -w /app node:18 sh -c 'npm install --no-audit --no-fund && npm test -- run'"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}"
                    sh "docker push ${BACKEND_IMAGE}"
                    sh "docker push ${DOCKER_HUB_USER}/task-logger-backend:latest"
                    sh "docker push ${FRONTEND_IMAGE}"
                    sh "docker push ${DOCKER_HUB_USER}/task-logger-frontend:latest"
                }
            }
        }

        stage('Deploy') {
            steps {
                withEnv(["BACKEND_IMAGE=${BACKEND_IMAGE}", "FRONTEND_IMAGE=${FRONTEND_IMAGE}"]) {
                    sh "docker-compose down && docker-compose up -d"
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check logs!'
        }
    }
}
