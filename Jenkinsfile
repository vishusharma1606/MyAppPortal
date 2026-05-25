pipeline {
    agent any

    stages {

        stage('Build Docker Image') {
            steps {
                sh '''
                docker rmi vishudock/myapptest:$BUILD_NUMBER || true  #remove existing image if it exists
                docker build --platform linux/amd64 -t vishudock/myapptest:$BUILD_NUMBER .
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
                docker stop myapp || true  #if container is already running, stop it
                docker rm myapp || true   #remove the container if it exists
                docker run -d -p 5001:5000 --name myapp vishudock/myapptest:testing
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

    }
}
