var app = angular.module('producerApp', [])
var elem = document.getElementById('message')

app.controller('messageController', function ($scope, $timeout) {
    $scope.messages = []
    $scope.newMessage = ''

    $scope.OnInit = () => {
        if (!localStorage.getItem('messagesConsumer')) {
            localStorage.setItem('messagesConsumer', '[]')
        } else {
            $scope.messages = JSON.parse(localStorage.getItem('messagesConsumer'))
        }
    }

    $scope.onInputEnter = (e) => {
        var key = e.keyCode || e.which
        if (key === 13) {
            e.preventDefault()
            if (e.target.value.length > 0) {
                $scope.sendMessage(e.target.value)
            }
        }
    }

    $scope.sendMessage = (message) => {
        const newMessage = $scope.saveMessage(message)

        axios({
            method: 'post',
            url: 'http://localhost:3000/producer/message',
            data: { message: newMessage }
        }).then((response) => {
            if (response.data.success) {
                $scope.updateStatusMessage(response.data.id, response.data.status)
            }
        }).catch((error) => {
            console.error(error);
        })
    }

    $scope.saveMessage = (message) => {
        let messages = JSON.parse(localStorage.getItem('messagesConsumer'))
        const newMessage = {
            id: Date.now(),
            text: message,
            date: new Date().toISOString(),
            status: 0
        }

        $scope.messages.push(newMessage)
        messages.push(newMessage)
        localStorage.setItem('messagesConsumer', JSON.stringify(messages));
        $scope.newMessage = ''
        return newMessage
    }

    $scope.updateStatusMessage = (id, status) => {
        let messages = JSON.parse(localStorage.getItem('messagesConsumer'))
        const index = messages.findIndex(el => el.id == id )
        if (index > -1) {
            messages[index].status = status
            localStorage.setItem('messagesConsumer', JSON.stringify(messages));

            $timeout(() => {
                $scope.messages[index].status = status
            }, 1)
        }
    }

    var socket = io('http://localhost:4555', {
      transports: ['websocket', 'polling', 'flashsocket']
    });

    socket.on('consumer/producer', (data) => {
        console.log(data)
        let response = JSON.parse(data)
        $timeout(() => {
            $scope.updateStatusMessage(response.id, response.status)
        }, 500)
    });
})
