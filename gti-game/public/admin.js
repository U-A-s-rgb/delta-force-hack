async function loadUsers() {
  const box = document.getElementById('userList');
  box.innerHTML = '<p class="empty">加载中...</p>';
  try {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    if (!data.ok) {
      box.innerHTML = '<p class="empty">加载失败</p>';
      return;
    }
    if (data.users.length === 0) {
      box.innerHTML = '<p class="empty">暂无注册人员</p>';
      return;
    }
    let html = '<table><thead><tr><th>用户名</th><th>注册时间</th><th>操作</th></tr></thead><tbody>';
    data.users.forEach(u => {
      const time = new Date(u.createdAt).toLocaleString('zh-CN');
      html += `<tr>
        <td>${escapeHtml(u.username)}</td>
        <td>${time}</td>
        <td><button class="del-btn" onclick="delUser('${escapeHtml(u.username)}')">删除</button></td>
      </tr>`;
    });
    html += '</tbody></table>';
    box.innerHTML = html;
  } catch (e) {
    box.innerHTML = '<p class="empty">网络错误</p>';
  }
}

async function delUser(username) {
  if (!confirm('确认删除该人员：' + username + ' ？')) return;
  try {
    const res = await fetch('/api/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const data = await res.json();
    if (data.ok) {
      loadUsers();
    } else {
      alert(data.msg || '删除失败');
    }
  } catch (e) {
    alert('网络错误');
  }
}

function logout() {
  if (confirm('确认退出登录？')) {
    window.location.href = '/';
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

loadUsers();
