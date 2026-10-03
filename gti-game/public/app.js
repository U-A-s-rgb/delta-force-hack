// 标签切换
const tabs = document.querySelectorAll('.tab');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    registerForm.classList.toggle('active', target === 'register');
    loginForm.classList.toggle('active', target === 'login');
    document.querySelectorAll('.msg').forEach(m => m.textContent = '');
  });
});

function setMsg(el, text, type) {
  el.textContent = text;
  el.className = 'msg ' + (type || '');
}

// 密码校验
function validatePassword(pwd) {
  if (typeof pwd !== 'string' || pwd.length !== 6) return false;
  if (!/[0-9]/.test(pwd)) return false;
  if (!/[a-z]/.test(pwd)) return false;
  if (!/[A-Z]/.test(pwd)) return false;
  return true;
}

// 注册
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value;
  const password2 = document.getElementById('regPassword2').value;
  const msg = document.getElementById('regMsg');

  if (!username) return setMsg(msg, '请输入用户名', 'error');
  if (!validatePassword(password)) {
    return setMsg(msg, '密码须为 6 位，且包含数字、大写字母、小写字母', 'error');
  }
  if (password !== password2) return setMsg(msg, '两次密码不一致', 'error');

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.ok) {
      setMsg(msg, '注册成功，请登录', 'success');
      setTimeout(() => {
        tabs[1].click();
        document.getElementById('loginUsername').value = username;
      }, 800);
    } else {
      setMsg(msg, data.msg, 'error');
    }
  } catch (err) {
    setMsg(msg, '网络错误，请重试', 'error');
  }
});

// 登录
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const msg = document.getElementById('loginMsg');

  if (!username || !password) return setMsg(msg, '请填写用户名和密码', 'error');

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.ok) {
      setMsg(msg, data.msg + '，正在跳转...', 'success');
      if (data.role === 'admin') {
        setTimeout(() => { window.location.href = '/admin.html'; }, 700);
      } else {
        sessionStorage.setItem('gti_username', username);
        setTimeout(() => { window.location.href = '/map.html'; }, 700);
      }
    } else {
      setMsg(msg, data.msg, 'error');
    }
  } catch (err) {
    setMsg(msg, '网络错误，请重试', 'error');
  }
});
