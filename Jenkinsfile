pipeline {
    agent any

    stages {

        stage('Build Docker Image') {
            steps {
                sh 'docker build --platform linux/amd64 -t myapp:testing .'
            }
        }

        stage('security scan using snyk') {
             steps {
                sh '''
                snyk test --docker myapp:testing
                sleep 50
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker run -d -p 5001:5000 --name myapp myapp:testing'
            }
        }

        stage('wait for application to start') {
            steps {
                sh 'sleep 5'
            }
        }

        stage('Test Application') {
            steps {
                sh 'curl http://127.0.0.1:5001'
            }
        }
    }
}
