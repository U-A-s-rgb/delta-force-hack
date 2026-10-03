// 地图节点数据与难度配置
const MAPS = {
  bakhsh: {
    title: '巴克什实验基地',
    subtitle: 'BAKHSH EXPERIMENTAL BASE',
    desc: '阿萨拉重要海港城市，哈夫克集团总部所在地。市中心矗立着世界上最高的建筑——高达 1500 米的哈夫克尖塔。2035 年爆发的暴力冲突将城市一分为二，哈夫克控制新城，阿萨拉卫队占据老城，巴克什自此变为割据地带。秘密实验基地中潜藏着哈夫克不为人知的研究项目。',
    difficulties: ['confidential', 'topsecret']
  },
  aerospace: {
    title: '航天基地',
    subtitle: 'AEROSPACE BASE',
    desc: '哈夫克势力盘踞的航天发射基地，秘密实施着开发计划。核心区位于地图正中，物资普遍分布于宿舍、中控、核心区和牢区。这里充满未来科技的气息，但也遍布重兵把守的关键路口，常驻首领德穆兰与哈德森。',
    difficulties: ['confidential', 'topsecret']
  },
  prison: {
    title: '潮汐监狱',
    subtitle: 'TIDAL PRISON',
    desc: '建于海中央的圆形高设防监狱，被潮汐包围。密集的室内复活点与复杂的环形结构使其成为极其凶险的封闭战场，只有最精锐的干员才被允许执行绝密级潜入任务。',
    difficulties: ['topsecret']
  },
  dam: {
    title: '重要水利设施',
    subtitle: 'DAM ZERO · WATER FACILITY',
    desc: '阿萨拉重要的水利枢纽——零号大坝。以大坝主体为核心，分为行政楼、地下金库、水泥厂、主变电站、游客中心等区域。地形开阔、路线众多，是新手干员积累行动经验的初级区域。',
    difficulties: ['normal']
  },
  resort: {
    title: '旅游胜地',
    subtitle: 'TOURIST RESORT',
    desc: '曾是人声鼎沸、生机盎然的滨海旅游度假区，如今因战乱荒废。优美的自然环境与复杂的建筑群落并存，适合普通行动与机密行动，收益与风险较为均衡。',
    difficulties: ['normal', 'confidential']
  }
};

const DIFF_INFO = {
  normal: { name: '普通', tag: 'NORMAL', cls: 'diff-normal' },
  confidential: { name: '机密', tag: 'CONFIDENTIAL', cls: 'diff-confidential' },
  topsecret: { name: '绝密', tag: 'TOP SECRET', cls: 'diff-topsecret' }
};

// 从登录态获取用户名
function getUsername() {
  return sessionStorage.getItem('gti_username') || '匿名干员';
}
document.getElementById('userName').textContent = getUsername();

let currentMap = null;
let selectedDiff = null;

// 绑定节点点击
document.querySelectorAll('.node').forEach(node => {
  node.addEventListener('click', () => {
    openPanel(node.dataset.id);
  });
});

function openPanel(mapId) {
  currentMap = mapId;
  selectedDiff = null;
  const data = MAPS[mapId];

  document.getElementById('pTitle').textContent = data.title;
  document.getElementById('pSubtitle').textContent = data.subtitle;
  document.getElementById('pDesc').textContent = data.desc;

  // 生成难度选项：全部三个难度都显示，不可用的置灰锁定
  const allDiffs = ['normal', 'confidential', 'topsecret'];
  const opts = document.getElementById('diffOptions');
  opts.innerHTML = '';
  allDiffs.forEach(d => {
    const info = DIFF_INFO[d];
    const available = data.difficulties.includes(d);
    const btn = document.createElement('div');
    btn.className = 'diff-btn ' + info.cls + (available ? '' : ' locked');
    btn.innerHTML = `
      <span class="diff-name">${info.name}</span>
      <span class="diff-tag">${available ? info.tag : '未开放'}</span>
    `;
    if (available) {
      btn.addEventListener('click', () => selectDiff(d));
    }
    opts.appendChild(btn);
  });

  document.getElementById('enterBtn').disabled = true;
  document.getElementById('overlay').classList.add('show');
}

function selectDiff(diff) {
  selectedDiff = diff;
  document.querySelectorAll('.diff-btn').forEach(b => b.style.outline = '');
  event.currentTarget.style.outline = '2px solid var(--neon)';
  event.currentTarget.style.outlineOffset = '2px';
  document.getElementById('enterBtn').disabled = false;
}

function closePanel() {
  document.getElementById('overlay').classList.remove('show');
  currentMap = null;
  selectedDiff = null;
}

// 进入地图
document.getElementById('enterBtn').addEventListener('click', () => {
  if (!currentMap || !selectedDiff) return;
  const mapTitle = MAPS[currentMap].title;
  const diffName = DIFF_INFO[selectedDiff].name;
  // 进入地图（占位界面，后续扩展具体玩法）
  document.body.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;color:#39ff9b;text-align:center;padding:20px;">
      <div style="font-size:28px;letter-spacing:4px;margin-bottom:12px;text-shadow:0 0 12px rgba(57,255,155,0.6);">进入任务区域</div>
      <div style="font-size:20px;color:#d6ffe8;margin-bottom:8px;">${mapTitle}</div>
      <div style="font-size:14px;color:#7fbfa0;letter-spacing:2px;">行动难度：${diffName}</div>
      <div style="margin-top:30px;font-size:13px;color:#7fbfa0;">地图玩法开发中...</div>
      <button onclick="history.back()" style="margin-top:24px;padding:10px 28px;background:transparent;border:1px solid #39ff9b;color:#39ff9b;border-radius:6px;cursor:pointer;font-family:inherit;">返回地图</button>
    </div>
  `;
});

// 点击遮罩关闭
document.getElementById('overlay').addEventListener('click', (e) => {
  if (e.target.id === 'overlay') closePanel();
});

function logout() {
  sessionStorage.removeItem('gti_username');
  window.location.href = '/';
}
