app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from 'public' directory
// 
// module.exports = router;
document.addEventListener('DOMContentLoaded', () => {
  const loginFormElement = document.querySelector('#login-form form');
  const signupFormElement = document.querySelector('#signup-form form');
  const loginErrorMessage = document.getElementById('login-error-message');
  const signupErrorMessage = document.getElementById('signup-error-message');

  // Login form password visibility
  const loginPasswordInput = document.getElementById('login-otp');
  const toggleLoginPasswordVisibilityButton = document.getElementById('toggle-password-visibility');
  const loginEyeOpenIcon = document.getElementById('eye-open');
  const loginEyeClosedIcon = document.getElementById('eye-closed');

  if (toggleLoginPasswordVisibilityButton && loginPasswordInput && loginEyeOpenIcon && loginEyeClosedIcon) {
    toggleLoginPasswordVisibilityButton.addEventListener('click', () => {
      const isPassword = loginPasswordInput.type === 'password';
      loginPasswordInput.type = isPassword ? 'text' : 'password';
      loginEyeOpenIcon.classList.toggle('hidden', !isPassword);
      loginEyeClosedIcon.classList.toggle('hidden', isPassword);
    });
  }

  // Signup form password visibility
  const signupPasswordInput = document.getElementById('signup-password');
  const toggleSignupPasswordVisibilityButton = document.getElementById('toggle-signup-password-visibility');
  const signupEyeOpenIcon = document.getElementById('signup-eye-open');
  const signupEyeClosedIcon = document.getElementById('signup-eye-closed');

  if (toggleSignupPasswordVisibilityButton && signupPasswordInput && signupEyeOpenIcon && signupEyeClosedIcon) {
    toggleSignupPasswordVisibilityButton.addEventListener('click', () => {
      const isPassword = signupPasswordInput.type === 'password';
      signupPasswordInput.type = isPassword ? 'text' : 'password';
      signupEyeOpenIcon.classList.toggle('hidden', !isPassword);
      signupEyeClosedIcon.classList.toggle('hidden', isPassword);
    });
  }

  const displayErrorMessage = (element, message) => {
    if (element) {
      element.textContent = message;
      element.classList.remove('hidden');
    }
  };

  const hideErrorMessage = (element) => {
    if (element) {
      element.classList.add('hidden');
      element.textContent = '';
    }
  };

  if (loginFormElement) {
    loginFormElement.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideErrorMessage(loginErrorMessage);

      const formData = new FormData(loginFormElement);
      const body = {
        email: formData.get('email'),
        password: formData.get('password')
      };

      try {
        const res = await fetch(loginFormElement.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (res.ok) {
          // Login successful, redirect to the URL provided by the backend
          if (data.redirect) {
            window.location.href = data.redirect;
          } else {
            // Fallback if redirect URL is not provided (shouldn't happen with current backend)
            alert('Login successful, but no redirect URL provided.');
          }
        } else {
          displayErrorMessage(loginErrorMessage, data.message || 'Login failed: Unknown error');
        }
      } catch (err) {
        console.error('Login error:', err);
        displayErrorMessage(loginErrorMessage, 'Error sending login request');
      }
    });
  }

  if (signupFormElement) {
    signupFormElement.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideErrorMessage(signupErrorMessage);

      const formData = new FormData(signupFormElement);
      const body = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
      };

      try {
        const res = await fetch(signupFormElement.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (res.redirected) {
          window.location.href = res.url;
        } else if (res.ok) {
          // If not redirected but still OK, it's an unexpected success, redirect to login
          window.location.href = '/login.html';
        } else {
          const data = await res.json(); // Only parse JSON if not redirected and not OK
          displayErrorMessage(signupErrorMessage, data.message || 'Signup failed: Unknown error');
        }
      } catch (err) {
        console.error(`Signup error: ${err}`);
        displayErrorMessage(signupErrorMessage, 'Error sending signup request');
      }
    });
  }
});
