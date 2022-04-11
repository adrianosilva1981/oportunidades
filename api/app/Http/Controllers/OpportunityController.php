<?php

namespace App\Http\Controllers;

use App\Http\Requests\OpportunityValidate;
use Illuminate\Http\Request;
use Dotenv\Exception\ValidationException;
use Illuminate\Http\Response;
use App\Models\Opportunity;


class OpportunityController extends Controller
{
    /**
     * Create a new OpportunityController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', []);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $input = $request->all();
            $opportunities = Opportunity::orderBy('created_at', 'DESC')->paginate((int)$_ENV['PAGE_ROWS']);
            return response()->json($opportunities, Response::HTTP_OK);
        } catch (ValidationException $validationException) {
            return response()->json(['message' => $validationException->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $exception) {
            return response()->json(['message' => $exception->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(OpportunityValidate $request)
    {
        try {
            $input = $request->all();
            $opportunity = Opportunity::create($input);
            return response()->json($opportunity, Response::HTTP_CREATED);
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
            $opportunity = Opportunity::find($id);
            return response()->json($opportunity, Response::HTTP_CREATED);
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
    public function update(OpportunityValidate $request, $id)
    {
        try {
            $input = $request->all();
            $opportunity = Opportunity::find($id);
            $opportunity->update($input);

            if ($opportunity) {
                return response()->json($opportunity, Response::HTTP_OK);
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
            if (Opportunity::where('id', $id)->delete()) {
                return response()->json(['message' => 'Oportunidade excluída com sucesso'], Response::HTTP_OK);
            }

            return response()->json(['message' => 'Update Error'], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (ValidationException $validationException) {
            return response()->json(['message' => $validationException->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $exception) {
            return response()->json(['message' => $exception->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the status of resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function stauts(Request $request, $id)
    {
        try {
            $opportunity = Opportunity::find($id);

            if (!$opportunity) {
                return response()->json(['message' => 'Oportunidade não encontrada'], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            if (!preg_match('/^[0-1]$/', $request->input('approved'))) {
                return response()->json(['message' => 'Valores permitidos: 0, 1'], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $opportunity->approved = (int)$request->input('approved');
            $opportunity->save();

            return response()->json(['message' => 'Oportunidade atualizada'], Response::HTTP_OK);
        } catch (ValidationException $validationException) {
            return response()->json(['message' => $validationException->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $exception) {
            return response()->json(['message' => $exception->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
