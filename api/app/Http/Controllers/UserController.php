<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserValidate;
use Illuminate\Support\Arr;
use App\Models\User;
use Dotenv\Exception\ValidationException;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Create a new UserController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['store']]);
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
            $users = User::orderBy('name', 'DESC')->paginate((int)$_ENV['PAGE_ROWS']);
            return response()->json($users, Response::HTTP_OK);
        } catch (ValidationException $validationException) {
            return response()->json(['message' => $validationException->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $exception) {
            return response()->json(['message' => $exception->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserValidate $request)
    {
        try {
            $input = $request->all();

            $input['password'] = Hash::make($input['password']);
            $user = User::create($input);
            return response()->json($user, Response::HTTP_CREATED);
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
            $user = User::find($id);
            return response()->json($user, Response::HTTP_CREATED);
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
    public function update(UserValidate $request, $id)
    {
        try {
            $input = $request->all();
            $input = Arr::except($input, array('email'));
            if (!empty($input['password'])) {
                $input['password'] = Hash::make($input['password']);
            } else {
                $input = Arr::except($input, array('password'));
            }

            $user = User::find($id);
            $user->update($input);

            if ($user) {
                return response()->json($user, Response::HTTP_OK);
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
            if (User::where('id', $id)->delete()) {
                return response()->json(['message' => 'Usuário excluído com sucesso'], Response::HTTP_OK);
            }

            return response()->json(['message' => 'Update Error'], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (ValidationException $validationException) {
            return response()->json(['message' => $validationException->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $exception) {
            return response()->json(['message' => $exception->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
