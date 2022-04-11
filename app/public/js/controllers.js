// For this exercise, I put all controllers in a single file for simplicity,
// but in a real case, each controller will created in a separated file ;)

const api = 'http://localhost:8000/api'
const appDomain = 'http://localhost:3000'

// === home controller ====================================================================================
app.controller('homeController', function($scope, $http) {
    $scope.name = ''
    let user = localStorage.getItem('me')
    if (!user) {
        const token = localStorage.getItem('token')
        $http.defaults.headers.common.Authorization = `Bearer ${token}`
        $http.post(`${api}/auth/me`).then(
            (response) => {
                localStorage.setItem('me', JSON.stringify(response.data))
                $scope.name = (response.data.name)
            },
            (error) => {
                console.log(error)
            }
        );
    } else {
        user = JSON.parse(user)
        $scope.name = (user.name)
    }
});

// === oportunidade controller =============================================================================
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

// === contact controller ====================================================================
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

// === login controller ====================================================================
app.controller('loginController', function($scope, $timeout, $http, $window) {
    $scope.warning = false
    $scope.message = ''
    $scope.form = {
        email: '',
        password: '',
    }

    $scope.login = () => {
        const fill = Object.keys($scope.form).filter(input => $scope.form[input]).length
        if (fill < Object.keys($scope.form).length) {
            $scope.warning = true
            $scope.message = 'Por favor, preencha os campos corretamente'
            $timeout(() => {
                $scope.warning = false
            }, 5000);
            return
        }

        $scope.loading = true;
        const payload = {
            email: $scope.form.email,
            password: $scope.form.password
        }
        $http.post(`${api}/auth/login`, payload).then(
            (response) => {
                $scope.loading = false;
                if (!response.data || !response.data.access_token) {
                    $.toast({
                        heading: 'Error',
                        text: 'Ops! Login inválido.',
                        position: 'top-right',
                    });
                    return
                }

                localStorage.setItem('token', response.data.access_token)
                $window.location.href = appDomain;
            },
            (error) => {
                $scope.loading = false;
                const messages = Object.keys(error.data.message).map(key => `${JSON.stringify(error.data.message[key])}<br>`)
                $.toast({
                    heading: 'Error',
                    text: `Por favor verifique:<br>${messages}`,
                    position: 'top-right',
                });
                console.log(error)
            }
        );
    }
})

// === home controller ====================================================================================
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