export interface LoginRequest {
    username: string;
    password: string
}

export interface LoginResponse {
    message: string,
    token: string,
}

export interface RegisterRequest {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;

}

export interface RegisterResponse {
    message: string,
    status: number,
}

export interface TransactionResponse {
    transaction_type_id: number;
    transaction_type_name: string;
    description: string;
    reff: string;
    amount: number;
    created_at: Date | string;
};

export interface WalletResponse {
    balance: number;
    transaction: TransactionResponse;
}

export interface HistoryResponse {
    balance: number;
    transaction: TransactionResponse[];
}

export interface Lov {
    value: string,
    label: string,
}

export interface FundTransferRequest {
    beneficiary: number,
    amount: number
}


