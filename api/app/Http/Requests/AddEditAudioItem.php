<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class AddEditAudioItem extends FormRequest
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
        return [
	        'songTitle' => 'required',
	        'artistId' => 'required'
        ];
    }

    public function messages()
    {
	    return [
		    'songTitle.required' => 'Please enter song title.',
		    'artistId.required' => 'Please choose an artist.',
		    'fileUpload.required' => 'Please choose a audio file.',
		    'allowedUsers.required' => 'Please pick at least one user to share with.'
	    ];
    }

    public function withValidator(Validator $validator)
    {
	    $validator->sometimes('fileUpload', 'required', function ($input) {
	    	// for now disable file upload when updating
	    	return $this->method() !== 'POST';
	    });

			$validator->sometimes('allowedUsers', 'required', function ($input) {
				return intval($input->visibility) === 2;
			});
    }
}
