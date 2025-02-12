'use client';

import React, { useState } from 'react';
import Hero from './components/Hero';
import Button from './components/UI/Button';
import Modal from './components/UI/Modal';
import useExpenseFlowStore from './expenseStore';
import html2canvas from "html2canvas";

const Page: React.FC = () => {

  const {
    name,
    state,
    totalSpent,
    participants,
    setName,
    addParticipant,
    removeParticipant,
    updateParticipantSpent,
    calculateDebts,
    flowReset,
    finishFlow,
    transactions,
    calculateTransactions,
  } = useExpenseFlowStore();

  const [isModalNameOpen, setIsModalNameOpen] = useState(false);
  const [isModalPeopleOpen, setIsModalPeopleOpen] = useState(false);
  const [isModalGastosOpen, setIsModalGastosOpen] = useState(false);
  const [newParticipant, setNewParticipant] = useState('');

  const handleSetName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleAddParticipant = () => {
    if (newParticipant.trim() !== '') {
      addParticipant({ name: newParticipant });
      setNewParticipant('');
    }
  };

  const handleRemoveParticipant = (index: number) => {
    removeParticipant(index);
  };

  const handleNextToPeople = () => {
    setIsModalNameOpen(false);
    setIsModalPeopleOpen(true);
  };

  const handleNextToGastos = () => {
    setIsModalPeopleOpen(false);
    setIsModalGastosOpen(true);
  };

  const handleBackModal = () => { 
    setIsModalNameOpen(false);
  }

  const handleBackModalPeople = () => { 
    setIsModalNameOpen(true);
    setIsModalPeopleOpen(false);
  }

  const handleBackModalGastos = () => { 
    setIsModalPeopleOpen(true);
    setIsModalGastosOpen(false);
  }

  const handleChangeSpent = (index: number, value: string) => {
    const spentValue = parseFloat(value) || 0;
    updateParticipantSpent(index, spentValue);
  };

  const flowFinished = () => {
    setIsModalGastosOpen(false);
    finishFlow();
    calculateDebts();
  };

  const isDisabledButton = name.length === 0;

  const handleDownload = (tableId : string) => {
    const tableElement = document.getElementById(tableId);
    
    if (tableElement) {
      html2canvas(tableElement).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${tableId}-${name}.png`;
        link.click();
      });
    } else {
      console.error("Tabla no encontrada");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <Hero />
      {totalSpent > 0 && state === 'success' && (
        <div className="p-6 bg-gray-800 rounded-lg shadow-md w-full">
  {/* Encabezado con datos generales */}
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-300 mb-2">Flujo de gasto: {name}</h2>
    <div className="text-gray-400">
      <p className="mb-1"><span className="font-semibold">Total gastos:</span> ${totalSpent}</p>
      <p className="mb-1"><span className="font-semibold">Participantes:</span> {participants.length}</p>
      <p className="mb-1"><span className="font-semibold">$/persona:</span> ${(totalSpent / participants.length).toFixed(2)}</p>
    </div>
  </div>

  {/* Contenedor para las dos tablas al lado */}
  <div className="flex gap-6">

    {/* Tabla de Gastos */}
    <div className="w-1/2 overflow-x-auto">
      <table className="w-full table-auto border-collapse border border-gray-400" id="Gastos">
        <thead>
          <tr className="bg-gray-400">
            <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-800">Nombre</th>
            <th className="px-4 py-2 border border-gray-300 text-right text-sm font-medium text-gray-800">Gasto</th>
            <th className="px-4 py-2 border border-gray-300 text-right text-sm font-medium text-gray-800">Deuda</th>
            <th className="px-4 py-2 border border-gray-300 text-right text-sm font-medium text-gray-800">Recibe</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant, index) => (
            <tr
              key={index}
              className={`${index % 2 === 0 ? 'bg-gray-500' : 'bg-gray-400'} hover:bg-gray-300`}
            >
              <td className="px-4 py-2 border border-gray-300 text-gray-800 text-sm">{participant.name}</td>
              <td className="px-4 py-2 border border-gray-300 text-right text-gray-800 text-sm">${participant.spent}</td>
              <td className="px-4 py-2 border border-gray-300 text-right text-gray-800 text-sm">${participant.debt}</td>
              <td className="px-4 py-2 border border-gray-300 text-right text-gray-800 text-sm">${participant.received}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex w-full justify-center gap-4 mt-4'>
        <Button text="Eliminar" onClick={flowReset} action='delete' />
        <Button text="Editar" onClick={() => setIsModalNameOpen(true)} action='edit' />
        <Button text="Descargar" onClick={() => handleDownload('Gastos')} action='download' />
      </div>
    </div>

    {/* Tabla de Transacciones */}
    {transactions.length > 0 && (
      <div className="w-1/2 overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-400" id="Transacciones">
          <thead>
            <tr className="bg-gray-400">
              <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-800">Deudor</th>
              <th className="px-4 py-2 border border-gray-300 text-right text-sm font-medium text-gray-800">Monto</th>
              <th className="px-4 py-2 border border-gray-300 text-right text-sm font-medium text-gray-800">Acreedor</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? 'bg-gray-500' : 'bg-gray-400'} hover:bg-gray-300`}
              >
                <td className="px-4 py-2 border border-gray-300 text-gray-800 text-sm">{transaction.debtor}</td>
                <td className="px-4 py-2 border border-gray-300 text-right text-gray-800 text-sm">${transaction.amount}</td>
                <td className="px-4 py-2 border border-gray-300 text-right text-gray-800 text-sm">{transaction.creditor}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='flex w-full justify-center gap-4 mt-4'>
          <Button text="Descargar" onClick={() => handleDownload('Transacciones')} action='download' />
        </div>
      </div>
    )}

  </div>

  {/* Botón para calcular divisiones */}
  <div className="border-t border-gray-400 w-full my-6"></div>
  <div className='flex w-full justify-center gap-4 mt-4'>
    <Button text="Calcular divisiones" onClick={calculateTransactions} action='success' disabled={transactions.length > 0} />
  </div>

        </div>
      )}
      <Button text={state === 'success' ? 'Crear un nuevo flujo' : 'Crea un flujo de gastos'} onClick={() => setIsModalNameOpen(true)} action='add' />

      {/* Modal: Nombre del flujo */}
      <Modal isOpen={isModalNameOpen} setIsOpen={setIsModalNameOpen} backModal={handleBackModal} title='Crea un flujo de gastos'>
        <label htmlFor="name">
          <input
            type="text"
            name="name"
            placeholder="Nombre del flujo de gastos"
            value={name}
            onChange={handleSetName}
            className="mt-2 px-4 py-2 bg-gray-100 rounded-lg w-full text-gray-800"
          />
        </label>
        <Button
          onClick={handleNextToPeople}
          disabled={isDisabledButton}
          action='success'
          text='Siguiente'
        />
      </Modal>

      {/* Modal: Participantes */}
      <Modal isOpen={isModalPeopleOpen} setIsOpen={setIsModalPeopleOpen} backModal={handleBackModalPeople} title={`Agregue a los participes del flujo ${name}`}>
        <div className="mt-4">
          {participants.map((participant, index) => (
            <div key={index} className="flex items-center justify-between mb-2">
              <span className="text-gray-600">{participant.name}</span>
              <button
                onClick={() => handleRemoveParticipant(index)}
                className="text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
        <div className="mt-8 flex gap-2">
          <input
            type="text"
            placeholder="Nombre del participante"
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
            className="px-4 py-2 bg-gray-100 rounded-lg flex-1 text-gray-800"
          />
          <button
            onClick={handleAddParticipant}
            className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
          >
            Agregar
          </button>
        </div>
        <Button
          onClick={handleNextToGastos}
          disabled={participants.length === 0}
          text='Siguiente'
          action='success'
        />
      </Modal>

      {/* Modal: Gastos */}
      <Modal isOpen={isModalGastosOpen} setIsOpen={setIsModalGastosOpen} backModal={handleBackModalGastos} title={`Indique los gastos del flujo ${name}`}>
        <div className='flex w-full justify-center gap-2 mt-4 flex-col'>
          {participants.map((participant, index) => (
            <div
              key={index}
              className="flex items-center gap-5 w-full bg-gray-900 rounded-lg p-4 shadow-sm"
            >
              <span className="text-gray-80 font-medium flex-1">
                {participant.name}
              </span>
              <input
                type="number"
                className="w-32 p-2 text-right text-blue-600 font-semibold bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                placeholder="0.00"
                onChange={(e) => handleChangeSpent(index, e.target.value)}
                value={participant.spent}
              />
            </div>
          ))}
          <Button
            onClick={flowFinished}
            action='success'
            text='Finalizar' 
          />
        </div>
      </Modal>

    </div>
  );
};

export default Page;
