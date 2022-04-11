app.controller('produtoController', function($scope, $http, $timeout, $routeParams) {
    $scope.products = []
    $scope.id = $routeParams.id || 0
    $scope.warning = false
    $scope.message = ''
    $scope.loading = false
    $scope.users = []

    $scope.form = {
        name: '',
        category: '',
        value: '',
        user_id: '',
        status: '',
    }

    $scope.getProducts = () => {
        $http.defaults.headers.common.Authorization = `Bearer ${token}`
        $http.get(`${api}/products`).then(
            (response) => {
                $scope.products = response.data.data
            },
            (error) => {
                console.log(error)
            }
        );
    }

    $scope.getProduct = async() => {
        const users = await $http.get(`${api}/users/`)
        $scope.users = users.data.data

        if ($scope.id) {
            $http.get(`${api}/products/${$scope.id}`).then(
                (response) => {
                    $scope.form.name = response.data.name
                    $scope.form.category = response.data.category
                    $scope.form.value = response.data.value
                    $scope.form.user_id = response.data.user_id
                    $scope.form.status = response.data.status
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
            $scope.form.user_id = $scope.form.user_id.id
            if ($scope.id > 0) {
                await $http.put(`${api}/products/${$scope.id}`, $scope.form)
            } else {
                await $http.post(`${api}/products`, $scope.form)
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
});