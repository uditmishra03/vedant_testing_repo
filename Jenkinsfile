pipeline {
    agent any

    environment {
        IMAGE_NAME = "uditmishra/react-app"
        IMAGE_TAG = "${BUILD_NUMBER}" // Use Jenkins BUILD_NUMBER as the image tag
        GIT_REPO_URL = 'git@github.com:uditmishra03/vedant_testing_repo.git'  // Git repo URL
    }

    stages {
        stage('Checkout Source') {
            steps {
                git branch: 'argo', url: GIT_REPO_URL
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

        // New Stage: Clean Up Docker Image After Push
        stage('Clean Up Docker Image') {
            steps {
                script {
                    // Remove the locally stored image to free up memory
                    sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"  // '|| true' avoids failure if the image is not found
                }
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
                        eval \$(ssh-agent -s)
                        ssh-add \$SSH_KEY
                        git config --global user.email "jenkins@yourdomain.com"
                        git config --global user.name "Jenkins CI"
                        git add argo/deployment.yaml
                        git commit -m "Update deployment image to ${IMAGE_NAME}:${IMAGE_TAG}"
                        git push ${GIT_REPO_URL} argo
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
