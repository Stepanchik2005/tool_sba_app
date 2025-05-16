import React, { useState } from 'react';
import MaterialForm from './MaterialForm';
import DetailForm from './DetailForm';
import MachineForm from './MachineForm';

function Menu() {
  const [section, setSection] = useState('materials');

  return (
    <div className="menu">
      <div className="nav">
        <button onClick={() => setSection('materials')}>Матеріал</button>
        <button onClick={() => setSection('details')}>Деталь</button>
        <button onClick={() => setSection('machines')}>Верстати</button>
        <button disabled>Технічні рішення</button>
      </div>
      <div className="section">
        {section === 'materials' && <MaterialForm />}
        {section === 'details' && <DetailForm />}
        {section === 'machines' && <MachineForm />}
      </div>
    </div>
  );
}

export default Menu;