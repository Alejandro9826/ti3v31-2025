"use client";

import React, { useState, useEffect } from 'react';

const INSCRIPCIONES_API_URL = "https://ejemplo-firebase-657d0-default-rtdb.firebaseio.com/inscripciones.json";
const TALLERES_API_URL = "https://ejemplo-firebase-657d0-default-rtdb.firebaseio.com/talleres.json";

const InscripcionesListado = () => {
    const [inscripciones, setInscripciones] = useState([]);
    const [talleres, setTalleres] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const inscripcionesResponse = await fetch(INSCRIPCIONES_API_URL);
                if (!inscripcionesResponse.ok) {
                    throw new Error(`Error HTTP al cargar inscripciones: ${inscripcionesResponse.status}`);
                }
                const inscripcionesData = await inscripcionesResponse.json();

                const talleresResponse = await fetch(TALLERES_API_URL);
                if (!talleresResponse.ok) {
                    throw new Error(`Error HTTP al cargar talleres: ${talleresResponse.status}`);
                }
                const talleresData = await talleresResponse.json();

                const inscripcionesArray = inscripcionesData
                    ? Object.values(inscripcionesData).filter(item => item !== null && item !== undefined)
                    : [];

                setInscripciones(inscripcionesArray);
                setTalleres(talleresData || {});

            } catch (err) {
                console.error("Error al obtener datos:", err);
                setError("No se pudieron cargar los datos de inscripciones o talleres. Por favor, inténtalo de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p className="mensaje-estado">Cargando listado de inscripciones...</p>;
    }

    if (error) {
        return <p className="mensaje-estado mensaje-error">Error: {error}</p>;
    }

    if (inscripciones.length === 0) {
        return <p className="mensaje-estado">No hay inscripciones disponibles en este momento.</p>;
    }

    return (
        <section className="listado-inscripciones">
            <h2>Listado de Inscripciones</h2>
            <div className="overflow-x-auto">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Taller</th>
                            <th>Descripción Taller</th>
                            <th>Profesor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inscripciones.map((inscripcion, index) => {
                            if (!inscripcion) {
                                return null;
                            }
                            const taller = talleres[inscripcion.tallerId] || {};
                            return (
                                <tr key={index}>
                                    <td data-label="Nombre:">{inscripcion.nombres} {inscripcion.apellidos}</td>
                                    <td data-label="Correo:" className="td-correo">{inscripcion.correo}</td>
                                    <td data-label="Taller:" className="td-taller">{taller.nombre || 'Desconocido'}</td>
                                    <td data-label="Descripción:" className="td-descripcion">{taller.descripcion || 'N/A'}</td>
                                    <td data-label="Profesor:" className="td-profesor">{taller.profesor || 'N/A'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default InscripcionesListado;