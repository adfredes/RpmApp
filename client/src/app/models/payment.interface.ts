export interface Payment{
    id: number,
    user: string,
    uploadDate: Date,
    paymentDate: Date,
    amount: number,
    ticketUrl: string
}