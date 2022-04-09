<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductValidate;
use Illuminate\Http\Request;
use Dotenv\Exception\ValidationException;
use Illuminate\Http\Response;
use App\Models\Products;


class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $input = $request->all();
            $products = Products::orderBy('name', 'DESC')->paginate((int)$_ENV['PAGE_ROWS']);
            return response()->json($products, Response::HTTP_OK);
        } catch (ValidationException $validationException) {
            return response()->json(['message' => $validationException->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $exception) {
            return response()->json(['message' => $exception->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(ProductValidate $request)
    {
        try {
            $input = $request->all();
            $product = Products::create($input);
            return response()->json($product, Response::HTTP_CREATED);
        } catch (ValidationException $validationException) {
            return response()->json(['message' => $validationException->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $exception) {
            return response()->json(['message' => $exception->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $product = Products::find($id);
            return response()->json($product, Response::HTTP_CREATED);
        } catch (ValidationException $validationException) {
            return response()->json(['message' => $validationException->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $exception) {
            return response()->json(['message' => $exception->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ProductValidate $request, $id)
    {
        try {
            $input = $request->all();
            $product = Products::find($id);
            $product->update($input);

            if ($product) {
                return response()->json($product, Response::HTTP_OK);
            }
            return response()->json(['message' => 'Update Error'], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (ValidationException $validationException) {
            return response()->json(['message' => $validationException->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $exception) {
            return response()->json(['message' => $exception->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

   /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            if (Products::where('id', $id)->delete()) {
                return response()->json(['message' => 'Produto excluído com sucesso'], Response::HTTP_OK);
            }

            return response()->json(['message' => 'Update Error'], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (ValidationException $validationException) {
            return response()->json(['message' => $validationException->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $exception) {
            return response()->json(['message' => $exception->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
