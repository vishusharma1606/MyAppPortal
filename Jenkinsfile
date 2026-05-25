pipeline {
    agent any

    stages {

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build --platform linux/amd64,linux/arm64 -t vishudock/myapptest:$BUILD_NUMBER .
                '''
            }
        }

        stage('security scan using snyk') {
            steps {
                sh '''
                snyk container test vishudock/myapptest:$BUILD_NUMBER --file=Dockerfile || true
                sleep 5
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                docker stop myapp || true
                docker rm myapp || true
                docker run -d -p 5001:5000 --name myapp vishudock/myapptest:$BUILD_NUMBER
                '''
            }
        }


        stage('Test Application') {
            steps {
                sh '''
                sleep 5   # wait for the container to start
                curl http://127.0.0.1:5001'''
            }
        }

        stage('push to dockerhub') {
            steps {
                sh '''
                docker push vishudock/myapptest:$BUILD_NUMBER
                '''
            }
        }

        stage('deploy kubernates') {
            steps {
                sh '''
                minikube status 
                kubectl create deployment myapp --image=vishudock/myapptest:$BUILD_NUMBER 
                kubectl expose deployment myapp --type=NodePort --port=5000
                minikube service myapp --url
                '''
            }
        }

    }
}