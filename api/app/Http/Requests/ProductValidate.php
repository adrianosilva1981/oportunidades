<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductValidate extends FormRequest
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
            'user_id' => 'required|integer|exists:users,id',
            'name' => 'required|string',
            'category' => 'required|string',
            'value' => 'required|numeric',
            'status' => 'required|integer',
        ];

        if ($this->method() == 'PUT') {
            array_splice($rules, 0, 1);
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
            'user_id.required' => 'O id do vendedor é obrigatório',
            'user_id.integer' => 'O id do vendedor inválido',
            'user_id.exists' => 'Vendedor não encontrado',
            'name.required' => 'O nome do produto é obrigatório',
            'name.string' => 'O nome do produto é inválido',
            'category.required' => 'O nome da catetoria é obrigatório',
            'category.string' => 'O nome da catetoria é inválido',
            'value.required' => 'O valor do produto é obrigatório',
            'value.numeric' => 'O valor do produto é inválido',
            'status.required' => 'O status do produto é obrigatório',
            'status.integer' => 'O status inválido',
        ];
    }
}