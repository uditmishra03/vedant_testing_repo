pipeline {
    agent any

    environment {
        IMAGE_NAME = "uditmishra/react-app"
        BUILD_TIMESTAMP = sh(script: "date +%Y-%m-%d_%H-%M-%S", returnStdout: true).trim()
        IMAGE_TAG = "${BUILD_TIMESTAMP}" // Use Jenkins BUILD_NUMBER as the image tag
        GIT_REPO_URL = 'git@github.com:uditmishra03/vedant_testing_repo.git'  // Git repo URL
    }

    stages {

        stage('Print Timestamp') {
                steps {
                    echo "Build Timestamp: ${BUILD_TIMESTAMP}"
                }
            }
        
        stage('Checkout Source') {
            steps {
                script {
                    def changeAuthor = sh(script: "git log -1 --pretty=format:'%an'", returnStdout: true).trim()
                    if (changeAuthor == "Jenkins CI") {
                        echo "Skipping build because Jenkins committed this change."
                        currentBuild.result = 'ABORTED'
                        error("Build stopped to prevent infinite loop.")
                    }
                    git branch: 'argo', url: GIT_REPO_URL
                }
            }
        }
        
        stage('Update App.js with New Image') {
            steps {
                script {
                    sh """
                    sed -i 's|Image: uditmishra/react-app:.*|Image: uditmishra/react-app:${IMAGE_TAG}|' src/App.js
                    """
                }
            }
        }

        stage('Build, Push and Clean Up Image') {
            steps {
            script {
                // Build the Docker image
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                
                // Login to DockerHub
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                sh 'echo "$PASS" | docker login -u "$USER" --password-stdin'
                }
                
                // Push the Docker image
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                
                // Clean up the Docker image
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
                        git add argo/deployment.yaml src/App.js
                        git commit -m "Update deployment image and App.js to ${IMAGE_NAME}:${IMAGE_TAG}"
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
