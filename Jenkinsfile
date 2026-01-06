pipeline {
    agent any

    environment {
        BACKEND_IMAGE = 'garcia123/task-logger-backend:latest'
        FRONTEND_IMAGE = 'garcia123/task-logger-frontend:latest'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    sh 'docker build -t $BACKEND_IMAGE .'
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    sh 'docker build -t $FRONTEND_IMAGE .'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    sh 'docker run --rm $BACKEND_IMAGE npm test'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker run --rm $FRONTEND_IMAGE npm test'
                }
            }
        }

        stage('Docker Hub Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                sh '''
                docker push $BACKEND_IMAGE
                docker push $FRONTEND_IMAGE
                '''
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
