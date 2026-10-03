const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 确保数据目录和用户文件存在
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '{}');

// 管理员账号（唯一）
const ADMIN = { username: '哈基米', password: '720702' };

function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch (e) {
    return {};
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// 密码哈希
function hashPwd(pwd) {
  return crypto.createHash('sha256').update(pwd).digest('hex');
}

// 密码校验：6 位，必须含数字、大写字母、小写字母
function validatePassword(pwd) {
  if (typeof pwd !== 'string' || pwd.length !== 6) return false;
  if (!/[0-9]/.test(pwd)) return false;
  if (!/[a-z]/.test(pwd)) return false;
  if (!/[A-Z]/.test(pwd)) return false;
  return true;
}

// 注册
app.post('/api/register', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.json({ ok: false, msg: '请填写用户名和密码' });
  }
  const name = String(username).trim();
  if (!name) return res.json({ ok: false, msg: '用户名不能为空' });
  if (name === ADMIN.username) {
    return res.json({ ok: false, msg: '该用户名已被占用' });
  }
  if (!validatePassword(password)) {
    return res.json({ ok: false, msg: '密码须为 6 位，且包含数字、大写字母、小写字母' });
  }
  const users = readUsers();
  if (users[name]) {
    return res.json({ ok: false, msg: '该用户名已被注册，请更换' });
  }
  users[name] = {
    password: hashPwd(password),
    createdAt: new Date().toISOString()
  };
  writeUsers(users);
  res.json({ ok: true, msg: '注册成功' });
});

// 登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.json({ ok: false, msg: '请填写用户名和密码' });
  }
  const name = String(username).trim();

  // 管理员
  if (name === ADMIN.username && password === ADMIN.password) {
    return res.json({ ok: true, role: 'admin', msg: '管理员登录成功' });
  }

  const users = readUsers();
  const user = users[name];
  if (!user) {
    return res.json({ ok: false, msg: '用户名不存在' });
  }
  if (user.password !== hashPwd(password)) {
    return res.json({ ok: false, msg: '密码错误' });
  }
  res.json({ ok: true, role: 'user', msg: '登录成功' });
});

// 管理员：获取用户列表
app.get('/api/admin/users', (req, res) => {
  const users = readUsers();
  const list = Object.keys(users).map(name => ({
    username: name,
    createdAt: users[name].createdAt
  }));
  res.json({ ok: true, users: list });
});

// 管理员：删除用户
app.post('/api/admin/delete', (req, res) => {
  const { username } = req.body || {};
  if (!username) return res.json({ ok: false, msg: '缺少用户名' });
  const users = readUsers();
  if (!users[username]) return res.json({ ok: false, msg: '用户不存在' });
  delete users[username];
  writeUsers(users);
  res.json({ ok: true, msg: '已删除' });
});

app.listen(PORT, () => {
  console.log(`GTI 游戏服务已启动: http://localhost:${PORT}`);
});
