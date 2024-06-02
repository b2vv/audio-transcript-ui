export interface IErrorMessage {
    message: string|string[];
    field?: string;
    type?: 'info' | 'warning' | 'error';
}

export interface IErrorState {
    errors?: IErrorMessage[];
}

export class ApiErrorService {
    protected errorMessage(response: Response) {
        if (response.status === -1 || response.status === 0) {
            return 'Could not connect to the server, please check your Internet connection';
        } else if (response.status === 404) {
            return 'The server returned Not Found error';
        } else if (response.status === 500) {
            return 'The server returned Internal error';
        } else if (response.status !== 200) {
            if (response.headers) {
                return `The server request failed with the status: ${response.status} ${response.statusText}`;
            } else {
                return 'The server request failed';
            }
        }
    }

    public getError(state: IErrorState, field?: string) {
        if (!state?.errors?.length) {
            return null;
        } else if (!field) {
            return state.errors[0];
        }
        const errors = state.errors.filter((error) => error.field === field);
        if (errors.length) {
            return errors[0];
        }
        return null;
    }

    public errorState(response: Response): IErrorState | undefined {
        const {responseJSON} = response as unknown as Response & {
            responseJSON: { details: IErrorMessage[]; message: string };
        };
        if (responseJSON && responseJSON.details) {
            return {
                errors: responseJSON.details
            };
        } else if (!response.ok) {
            return {
                errors: [{
                    message: responseJSON ? responseJSON.message : this.errorMessage(response) ?? '',
                    type: 'error'
                }]
            };
        }
    }
}

export const apiErrorService = new ApiErrorService();
