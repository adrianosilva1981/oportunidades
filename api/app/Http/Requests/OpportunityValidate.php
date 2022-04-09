<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OpportunityValidate extends FormRequest
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
            'seller_id' => 'required|integer|exists:users,id',
            'buyer_id' => 'required|integer|exists:users,id',
            'product_id' => 'required|integer|exists:products,id',
            'offer' => 'required|numeric',
            'approved' => 'in:0,1',
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
            'seller_id.required' => 'O id do vendedor é obrigatório',
            'seller_id.integer' => 'O id do vendedor inválido',
            'seller_id.exists' => 'Vendedor não encontrado',
            'buyer_id.required' => 'O id do comprador é obrigatório',
            'buyer_id.integer' => 'O id do comprador inválido',
            'buyer_id.exists' => 'Comprador não encontrado',
            'product_id.required' => 'O id do produto é obrigatório',
            'product_id.integer' => 'id do produto inválido',
            'product_id.exists' => 'id do produto não encontrado',
            'offer.required' => 'A oferta é obrigatório',
            'offer.numeric' => 'Oferta inválido',
            'approved.in' => 'Valor para aprovado inválido',
        ];
    }
}