pipeline {
    agent any

    environment {
        IMAGE_NAME = "uditmishra/react-app"
        IMAGE_TAG = "${BUILD_NUMBER}" // Use Jenkins BUILD_NUMBER as the image tag
    }

    stages {
        stage('Checkout Source') {
            steps {
                git branch: 'argo', url: 'https://github.com/uditmishra03/vedant_testing_repo.git'
            }
        }

        stage('Build Image') {
            steps {
                script {
                    sh "docker build -t  ${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }
        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo "$PASS" | docker login -u "$USER" --password-stdin'
                }
            }
        }

        stage('Push') {
            steps {
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }

        stage('Update Deployment YAML') {
            steps {
                script {
                    sh """
                    sed -i 's|image: uditmishra/react-app:.*|image: ${IMAGE_NAME}:${IMAGE_TAG}|' argo/deployment.yaml
                    """
                }
            }
        }

        stage('Commit & Push Changes') {
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: 'github-credentials', keyFileVariable: 'SSH_KEY')]) {
                        sh """
                        eval `ssh-agent -s`
                        ssh-add $SSH_KEY
                        git config --global user.email "jenkins@yourdomain.com"
                        git config --global user.name "Jenkins CI"
                        git add argo/deployment.yaml
                        git commit -m "Update deployment image to ${IMAGE_NAME}:${IMAGE_TAG}"
                        git push origin ${GIT_BRANCH}
                        """
                    }
                }
            }
        }

    }
    post {
        always {
            cleanWs()  // Cleans the workspace after job completion
        }
    }
}
