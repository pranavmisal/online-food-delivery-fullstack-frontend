export interface Address {
    id: number;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    mobile_number: number;
    full_name: string;
    addresses: Address[];
}