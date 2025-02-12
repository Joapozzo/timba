export type Participant = {
    name: string;
    spent: number;
    debt: number;
    received: number;
};

export type ExpenseFlow = {
    name: string;
    totalSpent: number;
    individualShare: number;
    participants: Participant[];
};