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
app.controller('oportunidadeController', function($scope, $http, $timeout, $location, $anchorScroll) {
    console.log('home works!');
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

        /* $http.post(`${api}/users`, $scope.form).then(
        	(response) => {
        		$scope.loading = false;
        		Object.keys($scope.form).forEach(key => {
        			$scope.form[key] = ''
        		})
        		$.toast({
        			heading: 'Success',
        			text: 'Usuário cadastrado com sucecco',
        			position: 'top-right',
        		});
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
        ); */
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

/* function dateFormat(data) {
	const dia = data.split("/")[0];
	const mes = data.split("/")[1];
	const ano = data.split("/")[2];
	return ("0" + dia).slice(-2) + '-' + ("0" + mes).slice(-2) + '-' + ano;
} */