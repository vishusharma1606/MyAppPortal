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

        stage('SonarQube Scan') {

            environment {
                SONAR_TOKEN = credentials('sonar-token')
            }

            steps {
                sh '''
                export PATH=$PATH:/opt/homebrew/bin

                /opt/homebrew/bin/sonar-scanner \
                -Dsonar.projectKey=myapp \
                -Dsonar.projectName=myapp \
                -Dsonar.sources=. \
                -Dsonar.host.url=http://localhost:9000 \
                -Dsonar.login=$SONAR_TOKEN
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

        stage('create deployment using kubectl') {
            steps {
                sh '''
                kubectl delete deployment myapp || true
                sleep 1
                kubectl create deployment myapp --image=vishudock/myapptest:$BUILD_NUMBER 
                sleep 10 # wait for the deployment to be ready
                '''
            }
        }

        stage('expose deployment using kubectl') {
            steps {
                sh '''
                kubectl delete service myapp || true
                sleep 2
                kubectl expose deployment myapp --type=NodePort --port=5000
                '''
            }
        }

        stage('test application ') {
            steps {
                sh '''
                /opt/homebrew/bin/minikube service myapp --url &
                '''
            }
        }

    }
}



