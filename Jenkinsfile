pipeline {
    agent any

    stages {

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t myapp:testing .'
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker run -d -p 5001:5000 --name myapp myapp:testing'
            }
        }

        stage('Test Application') {
            steps {
                sh 'curl http://127.0.0.1:5001'
            }
        }
    }
}