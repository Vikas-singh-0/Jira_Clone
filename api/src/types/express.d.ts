declare namespace Express {
    export interface Response {
        json: (data: any) => void;
    }
    export interface Request {
        currentUser: import('entities').User
    }
}
