app.controller('oportunidadeController', function($scope, $http, $timeout, $routeParams) {
    $scope.oppts = []
    $scope.id = $routeParams.id || 0
    $scope.warning = false
    $scope.message = ''
    $scope.loading = false
    $scope.oppt = {}
    $scope.newStatus = null

    $scope.form = {}

    $scope.setOpt = (oppt) => {
        $scope.oppt = oppt
        console.log($scope.oppt)
    }

    $scope.getOppts = () => {
        $http.defaults.headers.common.Authorization = `Bearer ${token}`
        $http.get(`${api}/opportunities`).then(
            (response) => {
                $scope.oppts = response.data
            },
            (error) => {
                console.log(error)
            }
        );
    }

    $scope.getOppt = async() => {
        const users = await $http.get(`${api}/users/`)
        const products = await $http.get(`${api}/products/`)

        $scope.products = products.data.data
        $scope.sellers = users.data.data.filter(el => el.type === 'seller')
        $scope.buyers = users.data.data.filter(el => el.type === 'buyer')
        $scope.form = {}

        if ($scope.id) {
            $http.get(`${api}/opportunities/${$scope.id}`).then(
                (response) => {
                    $scope.form.product_id = response.data.product_id
                    $scope.form.seller_id = response.data.seller_id
                    $scope.form.buyer_id = response.data.buyer_id
                    $scope.form.offer = response.data.offer
                    $scope.form.message = response.data.message
                    $scope.form.approved = response.data.approved
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
            const payload = {
                seller_id: $scope.form.product_id.id,
                product_id: $scope.form.product_id.id,
                buyer_id: $scope.form.buyer_id.id,
                offer: $scope.form.offer,
                message: $scope.form.message,
                approved: $scope.form.approved,
            }
            if ($scope.id > 0) {
                await $http.put(`${api}/opportunities/${$scope.id}`, payload)
            } else {
                await $http.post(`${api}/opportunities`, payload)
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

    $scope.changeStatus = (id) => {
        $http.put(`${api}/opportunities/stauts/${id}`, { approved: $scope.newStatus }).then(
            (response) => {
                $.toast({
                    heading: 'Success',
                    text: 'Tudo certo até aqui.',
                    position: 'top-right',
                });
                $scope.getOppts()
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
});