# Oportunidades

## Instruções

### Na raiz do repositório:

* `docker-compose up -d`

### No prompt de comando, navegar até `api` e executar:

* `composer install`
* criar o `.env` com as credenciais do `docker-compose.yml`
* Executar `php artisan jwt:secret` para gerar o JWT secret no .env
* `php artisan migrate`
* Subindo o serviço: `php artisan serve`
* Crie um usuário através do Postman usando a collection `Users`, na request `create` (`[POST]/api/users/`)

### Na pasta `app` executar:

* `npm i`
* criar o `.env` com os valores: `PORT=3000` e `URL=http://localhost`
* Subindo o serviço: `npm start`

### Colection do Postman com as requests do backend:

[https://www.getpostman.com/collections/9ff7b80b89c37bc76142](https://www.getpostman.com/collections/9ff7b80b89c37bc76142)