import './globals.css';

export const metadata = {
  title: 'Raíces Digitales - Inscripciones',
  description: 'Aplicación para visualizar el listado de inscripciones a los talleres artísticos de Raíces Digitales.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {}
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
        {}
      </head>
      {}
      <body>
        {children}
      </body>
    </html>
  );
}