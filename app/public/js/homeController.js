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