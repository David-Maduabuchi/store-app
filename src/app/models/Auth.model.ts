export interface LoginRegisterInterface {
    email: string,
    username: string,
    password: any,
    confirm_password: any,
}

export interface ServerResponse {
    user: {
        id: number,
        username: string,
        email: any,
        password: any
    },
    token: any,
    id: number,
    error: any,
  }