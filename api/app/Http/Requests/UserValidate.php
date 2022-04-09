<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserValidate extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */

    public function rules()
    {
        $rules =  [
            'name'     => 'required|string',
            'email'    => 'required|string|unique:users,email',
            'password' => 'required|min:8',
            'type'     => 'required|string|in:seller,buyer',
        ];


        if ($this->method() == 'PUT') {
            array_splice($rules, 1, 2);
        }

        return $rules;
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        throw new \Illuminate\Http\Exceptions\HttpResponseException(response()->json([
            'type' => 'error',
            'message' => $validator->errors(),
            'errors' => [],
            'status' => \Illuminate\Http\Response::HTTP_BAD_REQUEST
        ], \Illuminate\Http\Response::HTTP_BAD_REQUEST));
    }

    public function messages()
    {
        return [
            'id.required' => 'O id do usuário é obrigatório',
            'id.integer' => 'id do usuário inválido',
            'id.exists' => 'id do usuário inválido',
            'name.required' => 'O nome do usuário é obrigatório',
            'name.string' => 'O nome do usuário é inválido',
            'email.required' => 'O email do usuário é obrigatório',
            'email.string' => 'O email do usuário é inválido',
            'email.unique' => 'Este email já existe',
            'password.required' => 'A senha do usuário é obrigatório',
            'password.min' => 'A senha do usuário deve conter ao menos 8 dígitos',
            'type.required' => 'O tipo de usuário é obrigatório',
            'type.string' => 'Tipo de usuário inválido',
            'type.in' => 'Tipo de usuário inválido [seller, buyer]',
        ];
    }
}