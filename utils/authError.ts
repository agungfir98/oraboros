class AuthError extends Error {
	code: string;

	constructor(statusCode: string, message: string) {
		super(message);
		this.code = statusCode;
	}
}

export default AuthError;
