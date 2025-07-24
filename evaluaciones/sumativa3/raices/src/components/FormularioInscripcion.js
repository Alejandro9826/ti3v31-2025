"use client";

import React, { useState, useEffect } from 'react';

const INSCRIPCIONES_API_URL = "https://ejemplo-firebase-657d0-default-rtdb.firebaseio.com/inscripciones.json";
const TALLERES_API_URL = "https://ejemplo-firebase-657d0-default-rtdb.firebaseio.com/talleres.json";


const FormularioInscripcion = ({ onInscripcionExitosa }) => {
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        rut: '',
        fechaNacimiento: '',
        tallerId: '',
        correo: '',
        observaciones: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
    const [talleresDisponibles, setTalleresDisponibles] = useState([]);


    useEffect(() => {
        const fetchTalleres = async () => {
            try {
                const response = await fetch(TALLERES_API_URL);
                if (!response.ok) {
                    throw new Error(`Error al cargar talleres: ${response.status}`);
                }
                const data = await response.json();
                const talleresArray = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
                setTalleresDisponibles(talleresArray);
            } catch (err) {
                console.error("Error cargando talleres para el formulario:", err);
                setSubmitMessage({ type: 'error', text: 'No se pudieron cargar los talleres disponibles.' });
            }
        };
        fetchTalleres();
    }, []);

    const validate = () => {
        let newErrors = {};
        let isValid = true;

        if (!formData.nombres || formData.nombres.trim().length < 3) {
            newErrors.nombres = "Los nombres son obligatorios y deben tener al menos 3 caracteres.";
            isValid = false;
        }

        if (!formData.apellidos || formData.apellidos.trim().length < 3) {
            newErrors.apellidos = "Los apellidos son obligatorios y deben tener al menos 3 caracteres.";
            isValid = false;
        }

        const rutRegex = /^\d{7,8}-[\dkK]$/;
        if (!formData.rut || !rutRegex.test(formData.rut.trim())) {
            newErrors.rut = "El RUT es obligatorio y debe tener el formato 12345678-9 (sin puntos).";
            isValid = false;
        }

        const fechaNacimientoRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!formData.fechaNacimiento || !fechaNacimientoRegex.test(formData.fechaNacimiento.trim())) {
            newErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria y debe tener el formato dd/mm/aaaa.";
            isValid = false;
        } else {
            const [dia, mes, anio] = formData.fechaNacimiento.split('/').map(Number);
            const fechaNac = new Date(anio, mes - 1, dia);

            if (isNaN(fechaNac.getTime()) || fechaNac.getDate() !== dia || fechaNac.getMonth() !== mes - 1 || fechaNac.getFullYear() !== anio) {
                newErrors.fechaNacimiento = "La fecha de nacimiento no es válida.";
                isValid = false;
            } else {
                const hoy = new Date();
                if (fechaNac > hoy) {
                    newErrors.fechaNacimiento = "La fecha de nacimiento no puede ser en el futuro.";
                    isValid = false;
                }
                const mesActual = hoy.getMonth();
                const diaActual = hoy.getDate();
                const mesNac = fechaNac.getMonth();
                const diaNac = fechaNac.getDate();

                let edadCalculada = hoy.getFullYear() - fechaNac.getFullYear();
                if (mesActual < mesNac || (mesActual === mesNac && diaActual < diaNac)) {
                    edadCalculada--;
                }

                if (edadCalculada < 5) {
                    newErrors.fechaNacimiento = "Debe tener al menos 5 años para inscribirse.";
                    isValid = false;
                }
            }
        }

        if (!formData.tallerId) {
            newErrors.tallerId = "Debe seleccionar un taller de interés.";
            isValid = false;
        }

        const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}$/;
        if (!formData.correo || !correoRegex.test(formData.correo.trim())) {
            newErrors.correo = "El correo electrónico es obligatorio y debe tener un formato válido.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitMessage({ type: '', text: '' });

        if (!validate()) {
            setSubmitMessage({ type: 'error', text: 'Por favor, corrige los errores en el formulario antes de enviar.' });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(INSCRIPCIONES_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Error HTTP al enviar la inscripción: ${response.status}`);
            }

            const result = await response.json();
            console.log("Inscripción exitosa:", result);
            setSubmitMessage({ type: 'success', text: '¡Inscripción registrada con éxito!' });
            setFormData({
                nombres: '',
                apellidos: '',
                rut: '',
                fechaNacimiento: '',
                tallerId: '',
                correo: '',
                observaciones: ''
            });

            if (onInscripcionExitosa) {
                onInscripcionExitosa();
            }

        } catch (err) {
            console.error("Error al registrar inscripción:", err);
            setSubmitMessage({ type: 'error', text: `Error al registrar inscripción: ${err.message}. Por favor, inténtalo de nuevo.` });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="formulario">
            <h2>Inscríbete a un taller</h2>
            <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="nombres">Nombres:</label>
                <input
                    type="text"
                    id="nombres"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    className={errors.nombres ? 'field-error' : ''}
                />
                {errors.nombres && <span className="error-message">{errors.nombres}</span>}

                <label htmlFor="apellidos">Apellidos:</label>
                <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    className={errors.apellidos ? 'field-error' : ''}
                />
                {errors.apellidos && <span className="error-message">{errors.apellidos}</span>}

                <label htmlFor="rut">RUT (Ej: 12345678-9):</label>
                <input
                    type="text"
                    id="rut"
                    name="rut"
                    value={formData.rut}
                    onChange={handleChange}
                    className={errors.rut ? 'field-error' : ''}
                    title="Formato: nnnnnnnn-n o nnnnnnn-n (donde n es un número y el último dígito puede ser K)"
                />
                {errors.rut && <span className="error-message">{errors.rut}</span>}

                <label htmlFor="fechaNacimiento">Fecha de Nacimiento (dd/mm/aaaa):</label>
                <input
                    type="text"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    placeholder="dd/mm/aaaa"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className={errors.fechaNacimiento ? 'field-error' : ''}
                />
                {errors.fechaNacimiento && <span className="error-message">{errors.fechaNacimiento}</span>}

                <label htmlFor="taller">Taller de interés:</label>
                <select
                    id="taller"
                    name="tallerId"
                    value={formData.tallerId}
                    onChange={handleChange}
                    className={errors.tallerId ? 'field-error' : ''}
                >
                    <option value="">Selecciona un taller</option>
                    {talleresDisponibles.map(taller => (
                        <option key={taller.id} value={taller.id}>
                            {taller.nombre}
                        </option>
                    ))}
                </select>
                {errors.tallerId && <span className="error-message">{errors.tallerId}</span>}

                <label htmlFor="correo">Correo electrónico:</label>
                <input
                    type="text"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    className={errors.correo ? 'field-error' : ''}
                    title="Formato: direccion@dominio.pais. Solo letras, números, guiones y puntos para dirección y dominio. Solo letras y números para país."
                />
                {errors.correo && <span className="error-message">{errors.correo}</span>}

                <label htmlFor="observaciones">Observaciones (Opcional):</label>
                <textarea
                    id="observaciones"
                    name="observaciones"
                    rows="4"
                    value={formData.observaciones}
                    onChange={handleChange}
                ></textarea>

                <input type="submit" value={isSubmitting ? "Enviando..." : "Registrarme"} disabled={isSubmitting} />

                {submitMessage.text && (
                    <p className={submitMessage.type === 'success' ? 'mensaje-exito' : 'mensaje-error'}>
                        {submitMessage.text}
                    </p>
                )}
            </form>
        </section>
    );
};

export default FormularioInscripcion;