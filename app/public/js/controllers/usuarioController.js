app.controller('usuarioController', function($scope, $http, $timeout, $routeParams) {
    $scope.users = []
    $scope.id = $routeParams.id || 0
    $scope.warning = false
    $scope.message = ''
    $scope.loading = false

    $scope.form = {}

    $scope.getUsers = () => {
        $http.defaults.headers.common.Authorization = `Bearer ${token}`
        $http.get(`${api}/users`).then(
            (response) => {
                $scope.users = response.data.data
            },
            (error) => {
                console.log(error)
            }
        );
    }

    $scope.getUser = () => {
        if ($scope.id) {
            $http.get(`${api}/users/${$scope.id}`).then(
                (response) => {
                    $scope.form.name = response.data.name
                    $scope.form.email = response.data.email
                    $scope.form.type = response.data.type
                },
                (error) => {
                    $.toast({
                        heading: 'Error',
                        text: error,
                        position: 'top-right',
                    });
                    console.log(error)
                }
            )
        }
    }

    $scope.save = async() => {
        const fill = Object.keys($scope.form).filter(input => $scope.form[input]).length
        if (fill < Object.keys($scope.form).length) {
            $scope.warning = true
            $scope.message = 'Por favor, preencha os campos corretamente'
            $timeout(() => {
                $scope.warning = false
            }, 5000);
            return
        }

        try {
            if ($scope.id > 0) {
                const payload = {
                    name: $scope.form.name,
                    type: $scope.form.type,
                }
                await $http.put(`${api}/users/${$scope.id}`, payload)
            } else {
                await $http.post(`${api}/users`, $scope.form)
                Object.keys($scope.form).forEach(key => {
                    $scope.form[key] = ''
                })
            }
            $scope.loading = false;
        } catch (error) {
            $scope.loading = false;
            const messages = Object.keys(error.data.message).map(key => `${JSON.stringify(error.data.message[key])}<br>`)
            $.toast({
                heading: 'Error',
                text: JSON.stringify(messages),
                position: 'top-right',
            });
            console.log(error)
            return
        }

        $.toast({
            heading: 'Success',
            text: 'Tudo certo até aqui.',
            position: 'top-right',
        });
    }
})