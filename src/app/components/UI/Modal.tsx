import React from 'react';
import { FaArrowLeft } from "react-icons/fa";

interface ModalProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    title: string;
    backModal: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, setIsOpen, backModal, children, title }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div 
                className="bg-white rounded-lg shadow-lg w-full max-w-lg flex flex-col gap-4 relative"
                style={{
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    backgroundColor: 'var(--background)', 
                }}
            >
                {/* Contenedor superior con flexbox para alinear los elementos */}
                <div className="flex items-center justify-between absolute top-4 left-6 right-6 gap-4 p-2"
                    style={{
                        backgroundColor: 'var(--background)', 
                    }}>
                    <FaArrowLeft 
                        onClick={backModal} 
                        className="text-gray-400 hover:text-gray-500 text-xl cursor-pointer" 
                    />
                    <h2 className="text-xl font-bold text-gray-300">{title}</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-2xl text-gray-600 hover:text-gray-900"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Contenido del modal */}
                <div className="modal-scroll p-6 overflow-y-auto mt-12">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
