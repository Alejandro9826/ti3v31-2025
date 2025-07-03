document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('inscripcionForm');
    const nombresInput = document.getElementById('nombres');
    const apellidosInput = document.getElementById('apellidos');
    const rutInput = document.getElementById('rut');
    const fechaNacimientoInput = document.getElementById('fechaNacimiento');
    const tallerSelect = document.getElementById('taller');
    const correoInput = document.getElementById('correo');

    const nombresError = document.getElementById('nombresError');
    const apellidosError = document.getElementById('apellidosError');
    const rutError = document.getElementById('rutError');
    const fechaNacimientoError = document.getElementById('fechaNacimientoError');
    const tallerError = document.getElementById('tallerError');
    const correoError = document.getElementById('correoError');

    const mostrarError = (element, message, errorSpan) => {
        element.classList.add('field-error');
        errorSpan.textContent = message;
    };

    const limpiarError = (element, errorSpan) => {
        element.classList.remove('field-error');
        errorSpan.textContent = '';
    };

    const validarCampoObligatorio = (input, errorSpan, fieldName) => {
        if (input.value.trim() === '') {
            mostrarError(input, `El campo ${fieldName} es obligatorio.`, errorSpan);
            return false;
        }
        limpiarError(input, errorSpan);
        return true;
    };

    const validarMinLength = (input, errorSpan, fieldName, minLength) => {
        if (!validarCampoObligatorio(input, errorSpan, fieldName)) {
            return false;
        }
        if (input.value.trim().length < minLength) {
            mostrarError(input, `${fieldName} debe tener al menos ${minLength} caracteres.`, errorSpan);
            return false;
        }
        limpiarError(input, errorSpan);
        return true;
    };

    const validarRut = (input) => {
        if (!validarCampoObligatorio(input, rutError, 'RUT')) {
            return false;
        }

        let rutCompleto = input.value.trim().toUpperCase();
        rutCompleto = rutCompleto.replace(/\./g, '').replace(/-/g, '');

        if (!/^(\d+)([0-9K])$/.test(rutCompleto)) {
            mostrarError(input, 'Formato de RUT inválido. Ej: 12345678-9 o 1234567K', rutError);
            return false;
        }

        const cuerpo = rutCompleto.slice(0, -1);
        let dvIngresado = rutCompleto.slice(-1);

        if (!/^\d+$/.test(cuerpo)) {
            mostrarError(input, 'El cuerpo del RUT debe contener solo números.', rutError);
            return false;
        }

        if (!/^[0-9K]$/.test(dvIngresado)) {
            mostrarError(input, 'El dígito verificador debe ser un número o la letra K.', rutError);
            return false;
        }

        limpiarError(input, rutError);
        return true;
    };

    const validarFechaNacimiento = (input) => {
        if (!validarCampoObligatorio(input, fechaNacimientoError, 'Fecha de Nacimiento')) {
            return false;
        }

        const fechaStr = input.value.trim();
        const partesFecha = fechaStr.split('/');

        if (partesFecha.length !== 3) {
            mostrarError(input, 'Formato de fecha inválido. Use dd/mm/aaaa.', fechaNacimientoError);
            return false;
        }

        const dia = parseInt(partesFecha[0], 10);
        const mes = parseInt(partesFecha[1], 10);
        const anio = parseInt(partesFecha[2], 10);

        if (isNaN(dia) || dia < 1 || dia > 31 ||
            isNaN(mes) || mes < 1 || mes > 12 ||
            isNaN(anio) || anio < 0 || anio > 9999) {
            mostrarError(input, 'Fecha inválida. Revise día, mes y año (dd/mm/aaaa).', fechaNacimientoError);
            return false;
        }

        const fechaObj = new Date(anio, mes - 1, dia);

        if (fechaObj.getFullYear() !== anio || fechaObj.getMonth() + 1 !== mes || fechaObj.getDate() !== dia) {
            mostrarError(input, 'Fecha inexistente. Por favor, ingrese una fecha válida.', fechaNacimientoError);
            return false;
        }

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        fechaObj.setHours(0, 0, 0, 0);

        if (fechaObj > hoy) {
            mostrarError(input, 'La fecha de nacimiento no puede ser en el futuro.', fechaNacimientoError);
            return false;
        }

        let edad = hoy.getFullYear() - fechaObj.getFullYear();
        const mesDiff = hoy.getMonth() - fechaObj.getMonth();
        const diaDiff = hoy.getDate() - fechaObj.getDate();

        if (mesDiff < 0 || (mesDiff === 0 && diaDiff < 0)) {
            edad--;
        }

        if (edad < 14) {
            mostrarError(input, 'Debes tener al menos 14 años para postular.', fechaNacimientoError);
            return false;
        }

        limpiarError(input, fechaNacimientoError);
        return true;
    };

    const validarCorreo = (input) => {
        if (!validarCampoObligatorio(input, correoError, 'Correo electrónico')) {
            return false;
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}$/;
        if (!emailPattern.test(input.value.trim())) {
            mostrarError(input, 'Formato de correo inválido. Ejemplo: usuario@dominio.com', correoError);
            return false;
        }
        limpiarError(input, correoError);
        return true;
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        let formValido = true;

        formValido = validarMinLength(nombresInput, nombresError, 'Nombres', 3) && formValido;
        formValido = validarMinLength(apellidosInput, apellidosError, 'Apellidos', 3) && formValido;
        formValido = validarRut(rutInput) && formValido;
        formValido = validarFechaNacimiento(fechaNacimientoInput) && formValido;
        formValido = validarCampoObligatorio(tallerSelect, tallerError, 'Taller de Interés') && formValido;
        formValido = validarCorreo(correoInput) && formValido;

        if (formValido) {
            alert('¡Formulario enviado con éxito!\n\nRevisa la consola para ver los datos.');
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => (data[key] = value));
            console.log('Datos del formulario:', data);

            form.reset();
            document.querySelectorAll('.error-message').forEach(span => span.textContent = '');
            document.querySelectorAll('.field-error').forEach(element => element.classList.remove('field-error'));

        } else {
            alert('Por favor, corrige los errores en el formulario antes de enviar.');
        }
    });

    nombresInput.addEventListener('blur', () => validarMinLength(nombresInput, nombresError, 'Nombres', 3));
    apellidosInput.addEventListener('blur', () => validarMinLength(apellidosInput, apellidosError, 'Apellidos', 3));
    rutInput.addEventListener('blur', () => validarRut(rutInput));
    fechaNacimientoInput.addEventListener('blur', () => validarFechaNacimiento(fechaNacimientoInput));
    tallerSelect.addEventListener('blur', () => validarCampoObligatorio(tallerSelect, tallerError, 'Taller de Interés'));
    correoInput.addEventListener('blur', () => validarCorreo(correoInput));

    nombresInput.addEventListener('input', () => limpiarError(nombresInput, nombresError));
    apellidosInput.addEventListener('input', () => limpiarError(apellidosInput, apellidosError));
    rutInput.addEventListener('input', () => limpiarError(rutInput, rutError));
    fechaNacimientoInput.addEventListener('input', () => limpiarError(fechaNacimientoInput, fechaNacimientoError));
    tallerSelect.addEventListener('change', () => limpiarError(tallerSelect, tallerError));
    correoInput.addEventListener('input', () => limpiarError(correoInput, correoError));
});