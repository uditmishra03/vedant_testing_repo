pipeline {
    agent any

    // environment {
    //     AWS_DEFAULT_REGION = "us-east-1"
    // }

    stages {
        stage('Checkout Source') {
            steps {
                git branch: 'argo', url: 'https://github.com/uditmishra03/vedant_testing_repo.git'
            }
        }

        stage('Build Image') {
            steps {
                script {
                    sh 'docker build -t uditmishra/react-app:v1 .'
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
                sh 'docker push uditmishra/react-app:v1'
            }
        }

        // stage('Deploy to EKS') {
        //     steps {
        //         sh 'kubectl config use-context arn:aws:eks:us-east-1:266735832911:cluster/jenkinsProject'
        //         sh 'kubectl apply -f deployment.yaml'
        //         sh 'kubectl apply -f service.yaml'
        //     }
        // }
    }
    post {
        always {
            cleanWs()  // Cleans the workspace after job completion
        }
    }
}
