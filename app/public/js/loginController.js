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