import { create } from 'zustand';

interface Participant {
    name: string;
    spent: number;
    debt: number;
    received: number;
}

interface Transaction {
    debtor: string;
    amount: number;
    creditor: string;
}

interface ExpenseFlowState {
    name: string;
    totalSpent: number;
    participants: Participant[];
    state: 'loading' | 'success' | 'error';
    setName: (name: string) => void;
    addParticipant: (participant: Omit<Participant, 'spent' | 'debt' | 'received'>) => void;
    removeParticipant: (index: number) => void;
    updateParticipantSpent: (index: number, spent: number) => void;
    calculateDebts: () => void;
    flowReset: () => void;
    finishFlow: () => void;
    transactions: Transaction[];
    calculateTransactions: () => void;
}

const useExpenseFlowStore = create<ExpenseFlowState>((set) => ({
    name: '',
    totalSpent: 0,
    participants: [],
    transactions: [],
    state: 'loading',

    setName: (name: string) => set((state) => ({ ...state, name })),

    addParticipant: (participant) =>
        set((state) => ({
            participants: [...state.participants, { ...participant, spent: 0, debt: 0, received: 0 }],
        })),

    removeParticipant: (index: number) =>
        set((state) => ({
            participants: state.participants.filter((_, i) => i !== index),
        })),

    updateParticipantSpent: (index: number, spent: number) =>
        set((state) => {
            if (index < 0 || index >= state.participants.length) {
                console.error('Índice fuera de rango');
                return state;
            }
            const participants = [...state.participants];
            participants[index].spent = spent;
            const totalSpent = participants.reduce((sum, p) => sum + p.spent, 0);
            return { participants, totalSpent };
        }),

    calculateDebts: () =>
        set((state) => {
            if (state.participants.length === 0) {
                console.warn('No hay participantes para calcular deudas');
                return state;
            }
    
            const participantsDebt = parseFloat((state.totalSpent / state.participants.length).toFixed(1));

            const participants = state.participants.map((p) => {
                if (p.spent > participantsDebt) {
                    return { ...p, received: parseFloat((p.spent - participantsDebt).toFixed(1)), debt: 0 };
                }
                return { ...p, debt: parseFloat((participantsDebt - p.spent).toFixed(1)), received: 0 };
            });
    

    
            return { participants };
    }),

    calculateTransactions: () =>
        set((state) => { 
            const participants = state.participants;
            const debtors = participants.filter((p) => p.debt > 0).map((p) => ({ ...p }));
            const creditors = participants.filter((p) => p.received > 0).map((p) => ({ ...p }));
            const transactions: Transaction[] = [];
    
            debtors.forEach((debtor) => {
                let debtRemaining = debtor.debt;
    
                creditors.forEach((creditor) => {
                    if (debtRemaining > 0 && creditor.received > 0) {
                        const payment = Math.min(debtRemaining, creditor.received);
                        transactions.push({
                            debtor: debtor.name,
                            amount: parseFloat(payment.toFixed(1)),
                            creditor: creditor.name,
                        });
    
                        // Actualizar valores temporales para el cálculo
                        debtRemaining -= payment;
                        creditor.received -= payment;
                    }
                });
            });
    
            return { transactions };
    }),
    
    finishFlow: () => 
        set((state) => {
            const updatedState = { 
                ...state, 
                state: 'success', // Actualizamos solo el campo 'state'
            };
    
            // Guardamos el estado actualizado en localStorage
            localStorage.setItem('expenseFlowState', JSON.stringify(updatedState)); 
    
            // Retornamos el estado actualizado
            return updatedState;
        }),
    
    flowReset: () => set({ name: '', totalSpent: 0, participants: [], state: 'loading', transactions: [] }),

}));

export default useExpenseFlowStore;
