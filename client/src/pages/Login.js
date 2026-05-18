import { renderNavbar } from '../components/Navbar.js';
import { renderSidebar, initSidebar } from '../components/Carrito.js';
import { usuariosService } from '../services/api.js';
import { mostrarToast } from '../components/Toast.js';

export function renderLogin(container) {
  container.innerHTML = `
    ${renderNavbar('#/login')}
    ${renderSidebar()}
    <div class="seccion">
      <div id="form-container">${formLogin()}</div>
    </div>
    <footer>© 2026 Carpas El Fuerte</footer>
  `;
  initSidebar();
  bindLogin();
}

function formLogin() {
  return `
    <div class="form-card">
      <h2>🔐 Iniciar Sesión</h2>
      <div class="campo">
        <label>Email</label>
        <input type="email" id="login-email" placeholder="tu@email.com">
        <div class="error-msg" id="err-login-email"></div>
      </div>
      <div class="campo">
        <label>Contraseña</label>
        <input type="password" id="login-password" placeholder="••••••">
        <div class="error-msg" id="err-login-password"></div>
      </div>
      <button class="btn btn-primary" id="btn-login" style="width:100%;margin-top:.5rem">
        Ingresar
      </button>
      <p style="text-align:center;margin-top:1rem;font-size:.9rem">
        ¿No tienes cuenta?
        <a href="#" id="link-registro" style="color:var(--verde);font-weight:600">Registrate</a>
      </p>
      <p style="text-align:center;margin-top:.5rem">
        <a href="#/" style="color:var(--gris);font-size:.85rem">← Volver al inicio</a>
      </p>
    </div>
  `;
}

function formRegistro() {
  return `
    <div class="form-card">
      <h2>✍️ Crear Cuenta</h2>
      <div class="campo">
        <label>Nombre completo</label>
        <input type="text" id="reg-nombre" placeholder="Juan Pérez">
        <div class="error-msg" id="err-reg-nombre"></div>
      </div>
      <div class="campo">
        <label>Email</label>
        <input type="email" id="reg-email" placeholder="tu@email.com">
        <div class="error-msg" id="err-reg-email"></div>
      </div>
      <div class="campo">
        <label>Contraseña <small style="color:#aaa">(mínimo 6 caracteres)</small></label>
        <input type="password" id="reg-password" placeholder="••••••">
        <div class="error-msg" id="err-reg-password"></div>
      </div>
      <div class="campo">
        <label>Confirmar Contraseña</label>
        <input type="password" id="reg-confirm" placeholder="••••••">
        <div class="error-msg" id="err-reg-confirm"></div>
      </div>
      <button class="btn btn-primary" id="btn-registro" style="width:100%;margin-top:.5rem">
        Crear cuenta
      </button>
      <p style="text-align:center;margin-top:1rem;font-size:.9rem">
        ¿Ya tenés cuenta?
        <a href="#" id="link-login" style="color:var(--verde);font-weight:600">Iniciá sesión</a>
      </p>
    </div>
  `;
}

function bindLogin() {
  document.getElementById('link-registro')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('form-container').innerHTML = formRegistro();
    bindRegistro();
  });

  document.getElementById('btn-login')?.addEventListener('click', async () => {
    limpiarErrores();
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email)    { setError('err-login-email',    'El email es obligatorio'); return; }
    if (!password) { setError('err-login-password', 'La contraseña es obligatoria'); return; }

    const btn = document.getElementById('btn-login');
    btn.disabled = true; btn.textContent = 'Ingresando...';

    try {
      const res = await usuariosService.login({ email, password });
      mostrarToast(`👋 ¡Bienvenido ${res.data.nombre}!`, 'success');
      setTimeout(() => { window.location.hash = '/'; }, 1500);
    } catch (err) {
      if (err.errores) {
        err.errores.forEach(e => setError(`err-login-${e.campo}`, e.mensaje));
      } else {
        mostrarToast('❌ ' + err.message, 'error');
      }
    } finally {
      btn.disabled = false; btn.textContent = 'Ingresar';
    }
  });
}

function bindRegistro() {
  document.getElementById('link-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('form-container').innerHTML = formLogin();
    bindLogin();
  });

  document.getElementById('btn-registro')?.addEventListener('click', async () => {
    limpiarErrores();
    const nombre          = document.getElementById('reg-nombre').value.trim();
    const email           = document.getElementById('reg-email').value.trim();
    const password        = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm').value;

    // Validación en el frontend antes de enviar
    let valido = true;
    if (nombre.length < 3)           { setError('err-reg-nombre',   'Mínimo 3 caracteres'); valido = false; }
    if (!email.includes('@'))        { setError('err-reg-email',    'Email inválido'); valido = false; }
    if (password.length < 6)         { setError('err-reg-password', 'Mínimo 6 caracteres'); valido = false; }
    if (password !== confirmPassword) { setError('err-reg-confirm',  'Las contraseñas no coinciden'); valido = false; }
    if (!valido) return;

    const btn = document.getElementById('btn-registro');
    btn.disabled = true; btn.textContent = 'Creando cuenta...';

    try {
      await usuariosService.registrar({ nombre, email, password, confirmPassword });
      mostrarToast('🎉 ¡Cuenta creada! Ya podés iniciar sesión.', 'success');
      document.getElementById('form-container').innerHTML = formLogin();
      bindLogin();
    } catch (err) {
      // Mostrar errores campo por campo si vienen del backend
      if (err.errores) {
        err.errores.forEach(e => setError(`err-reg-${e.campo}`, e.mensaje));
      } else {
        mostrarToast('❌ ' + err.message, 'error');
      }
    } finally {
      btn.disabled = false; btn.textContent = 'Crear cuenta';
    }
  });
}

function setError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.closest('.campo')?.classList.add('error');
  }
}

function limpiarErrores() {
  document.querySelectorAll('.error-msg').forEach(e => e.textContent = '');
  document.querySelectorAll('.campo.error').forEach(e => e.classList.remove('error'));
}
