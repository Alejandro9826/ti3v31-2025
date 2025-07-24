"use client";

import React, { useState } from 'react';

import InscripcionesListado from '../components/InscripcionesListado';
import FormularioInscripcion from '../components/FormularioInscripcion';

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFormularioSuccess = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div>
      {}
      <header>
        <h1>Raíces Digitales</h1>
        <p className="eslogan">Arte que une a la comunidad</p>
      </header>

      {}
      <section className="presentacion">
        {}
        <img src="/assets/el-arte-callejero-forma-parte-de-los-procesos-de-creacion-de-cultura.jpg" alt="Arte urbano representativo" />
      </section>

      {}
      <section className="talleres">
        <h2>Nuestros Talleres</h2>
        <div className="cards">
          <article className="card">
            <h3>Teatro</h3>
            <p>Combinamos actuación, música y escenografía para expresarte libremente.</p>
            <p><strong>Horario:</strong> Lunes a Viernes, 08:30 - 12:00</p>
          </article>
          <article className="card">
            <h3>Danza</h3>
            <p>Explora el movimiento y la música para conectar con tus emociones.</p>
            <p>Conecta con tus emociones a través del movimiento y la música.</p>
            <p><strong>Horario:</strong> Martes y Jueves, 15:00 - 17:00</p>
          </article>
          <article className="card">
            <h3>Música Urbana</h3>
            <p>Descubre el hip-hop, trap y más, creando sonidos desde la calle.</p>
            <p><strong>Horario:</strong> Miércoles y Viernes, 16:00 - 19:00</p>
          </article>
        </div>
      </section>

      {}
      {}
      <InscripcionesListado key={refreshKey} />

      {}
      {}
      <FormularioInscripcion onInscripcionExitosa={handleFormularioSuccess} />

      {}
      <footer>
        <p>Síguenos en redes sociales:</p>
        <ul>
          {}
          <li><a href="#"><img src="/Facebook-logo-1.png" alt="Facebook" className="social-icon" /></a></li>
          <li><a href="#"><img src="/Instagram-Logo-2016.png" alt="Instagram" className="social-icon" /></a></li>
          <li><a href="#"><img src="/tiktok_PNG30.png" alt="TikTok" className="social-icon" /></a></li>
        </ul>
        <p>Contacto: <a href="mailto:raicesdigitales@gmail.com">raicesdigitales@gmail.com</a></p>
      </footer>
    </div>
  );
}