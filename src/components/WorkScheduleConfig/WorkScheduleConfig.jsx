import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import './WorkScheduleConfig.css';

const WorkScheduleConfig = () => {
  const [workDays, setWorkDays] = useState({
    domingo: { start1: '', end1: '', start2: '', end2: '', isWorking: false },
    lunes: { start1: '', end1: '', start2: '', end2: '', isWorking: false },
    martes: { start1: '', end1: '', start2: '', end2: '', isWorking: false },
    miércoles: { start1: '', end1: '', start2: '', end2: '', isWorking: false },
    jueves: { start1: '', end1: '', start2: '', end2: '', isWorking: false },
    viernes: { start1: '', end1: '', start2: '', end2: '', isWorking: false },
    sábado: { start1: '', end1: '', start2: '', end2: '', isWorking: false },
  });
  const [uidPeluquero, setUidPeluquero] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUidPeluquero(user.uid);
      loadWorkSchedule(user.uid);
    }
  }, []);

  const loadWorkSchedule = async (uid) => {
    const scheduleDocRef = doc(db, 'horarios', uid);
    const scheduleDoc = await getDoc(scheduleDocRef);
    if (scheduleDoc.exists()) {
      setWorkDays(scheduleDoc.data());
    }
  };

  const handleSave = async () => {
    if (!uidPeluquero) return;

    try {
      const scheduleDocRef = doc(db, 'horarios', uidPeluquero);
      await setDoc(scheduleDocRef, workDays);
      Swal.fire({
        title: 'Horario guardado correctamente',
        icon: 'success',
        background: 'black', 
        color: 'white', 
        confirmButtonText: 'Ok'
    });
    } catch (error) {
      console.error('Error guardando horario: ', error);
      Swal.fire({
        title: 'Error al guardad el horario',
        icon: 'error',
        background: 'black', 
        color: 'white', 
        confirmButtonText: 'Ok'
    });
    }
  };

  const handleChange = (day, field, value) => {
    setWorkDays((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  // Definir los días de la semana comenzando desde el domingo
  const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  return (
    <div className='div-config'>
      <h2 className='h2-horarios' >Configurar Días y Horarios de Trabajo</h2>
      {daysOfWeek.map((day) => (
        <div key={day} className='div-day'>
          <div className='div-trabajo'>
            <h3> ¿Trabajas el día {day.charAt(0).toUpperCase() + day.slice(1)} ?</h3>
            <label className="cyberpunk-checkbox-label">
              <input
                className="cyberpunk-checkbox"
                type="checkbox"
                checked={workDays[day].isWorking}
                onChange={(e) => handleChange(day, 'isWorking', e.target.checked)}
              />
            </label>
          </div>

          {workDays[day].isWorking && (
            <>
              <div className='div-hora1'>
                {/* Primer rango horario */}
                <label>
                  Turno mañana
                  <input
                    className='input-hora'
                    type="time"
                    value={workDays[day].start1}
                    onChange={(e) => handleChange(day, 'start1', e.target.value)}
                  />
                </label>
                <label>
                  a
                  <input
                    className='input-hora'
                    type="time"
                    value={workDays[day].end1}
                    onChange={(e) => handleChange(day, 'end1', e.target.value)}
                  />
                </label>
              </div>
              {/* Segundo rango horario */}
              <div className='div-hora2'>
                <label>
                  Turno tarde
                  <input
                    className='input-hora'
                    type="time"
                    value={workDays[day].start2}
                    onChange={(e) => handleChange(day, 'start2', e.target.value)}
                  />
                </label>
                <label>
                  a
                  <input
                    className='input-hora'
                    type="time"
                    value={workDays[day].end2}
                    onChange={(e) => handleChange(day, 'end2', e.target.value)}
                  />
                </label>
              </div>
            </>
          )}
        </div>
      ))}
      <button className='button-horario' onClick={handleSave}>Guardar Horario</button>
    </div>
  );
};

export default WorkScheduleConfig;
