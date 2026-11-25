
const $ = (selector) => document.querySelector(selector);
const STORAGE_KEY = 'servicePlannerData';

let features = [
  { title: '', description: '' },
  { title: '', description: '' },
  { title: '', description: '' }
];

let techDescriptions = {};

const techInputs = [...document.querySelectorAll('input[name="tech"]')];

// HTML 문자열 안전 처리
function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[char]);
}

// 입력 데이터 수집
function getData() {
  return {
    serviceName: $('#serviceName').value,
    problem: $('#problem').value,
    target: $('#target').value,
    features: features,
    technologies: techInputs
      .filter(input => input.checked)
      .map(input => ({
        name: input.value,
        description: techDescriptions[input.value] || ''
      }))
  };
}

// 자동 저장
function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getData()));
    $('#saveStatus').textContent = '✓ 자동 저장 완료';
  } catch (error) {
    $('#saveStatus').textContent = '저장 공간을 사용할 수 없습니다.';
  }
}

// 기능 입력 UI 생성
function renderFeatures() {
  $('#featureList').innerHTML = features.map((feature, index) => `
    <div class="feature-item">
      <div class="feature-number">${index + 1}</div>
      <div class="feature-input">
        <input
          type="text"
          data-feature-title="${index}"
          placeholder="핵심 기능 이름 (예: 실시간 위치 정보 제공)"
          value="${escapeHTML(feature.title)}"
        >
        <textarea
          data-feature-description="${index}"
          placeholder="이 기능이 어떤 역할을 하는지 구체적으로 작성하세요."
        >${escapeHTML(feature.description)}</textarea>
      </div>
      <button class="delete-btn"
        data-delete-feature="${index}"
        aria-label="기능 삭제">×</button>
    </div>
  `).join('');

  $('#featureCount').textContent = `${features.length}개`;
}

// 기능 추가
$('#addFeature').addEventListener('click', () => {
  features.push({ title: '', description: '' });
  renderFeatures();
  saveData();
  renderPreview();
});

// 기능 입력 및 삭제
$('#featureList').addEventListener('input', event => {
  const titleIndex = event.target.dataset.featureTitle;
  const descriptionIndex = event.target.dataset.featureDescription;

  if (titleIndex !== undefined) {
    features[Number(titleIndex)].title = event.target.value;
  }

  if (descriptionIndex !== undefined) {
    features[Number(descriptionIndex)].description = event.target.value;
  }

  saveData();
  renderPreview();
});

$('#featureList').addEventListener('click', event => {
  const index = event.target.dataset.deleteFeature;

  if (index === undefined) return;

  features.splice(Number(index), 1);
  renderFeatures();
  saveData();
  renderPreview();
});

// 선택한 기술에 따른 설명 입력 UI
function renderTechDetails() {
  const selected = techInputs.filter(input => input.checked);

  $('#techDetails').innerHTML = selected.map(input => `
    <div class="tech-detail">
      <label>${escapeHTML(input.value)} - 어떻게 활용할 것인가요?</label>
      <textarea
        data-tech="${escapeHTML(input.value)}"
        rows="3"
        placeholder="${escapeHTML(input.value)}을(를) 활용할 구체적인 구현 방법을 작성하세요."
      >${escapeHTML(techDescriptions[input.value] || '')}</textarea>
    </div>
  `).join('');

  renderPreview();
}

// 기술 선택 이벤트
techInputs.forEach(input => {
  input.addEventListener('change', () => {
    renderTechDetails();
    saveData();
  });
});

// 기술 설명 입력 이벤트
$('#techDetails').addEventListener('input', event => {
  const tech = event.target.dataset.tech;

  if (!tech) return;

  techDescriptions[tech] = event.target.value;
  saveData();
  renderPreview();
});

// 실시간 미리보기
function renderPreview() {
  const data = getData();

  const featuresHTML = data.features.map((feature, index) => `
    <div class="preview-feature">
      <strong>${index + 1}. ${escapeHTML(feature.title || '기능 이름 미입력')}</strong>
      <p>${escapeHTML(feature.description || '기능 설명을 입력해 주세요.')}</p>
    </div>
  `).join('');

  const technologiesHTML = data.technologies.length
    ? data.technologies.map(tech =>
        `<span class="tech-tag">${escapeHTML(tech.name)}</span>`
      ).join('')
    : '<p>선택된 기술이 없습니다.</p>';

  const detailsHTML = data.technologies.map(tech => `
    <div class="preview-feature">
      <strong>${escapeHTML(tech.name)}</strong>
      <p>${escapeHTML(tech.description || '활용 방법을 입력해 주세요.')}</p>
    </div>
  `).join('');

  $('#previewContent').innerHTML = `
    <div class="preview-section">
      <h3>01. 서비스(프로젝트) 이름</h3>
      <p><strong>${escapeHTML(data.serviceName || '서비스 이름을 입력해 주세요.')}</strong></p>
    </div>

    <div class="preview-section">
      <h3>02. 해결하려는 문제</h3>
      <p>${escapeHTML(data.problem || '해결하려는 문제를 입력해 주세요.')}</p>
    </div>

    <div class="preview-section">
      <h3>03. 주요 대상 사용자</h3>
      <p>${escapeHTML(data.target || '주요 대상 사용자를 입력해 주세요.')}</p>
    </div>

    <div class="preview-section">
      <h3>04. 핵심 기능</h3>
      ${featuresHTML}
    </div>

    <div class="preview-section">
      <h3>05. 구현 기술</h3>
      <div>${technologiesHTML}</div>
    </div>

    <div class="preview-section">
      <h3>06. 기술별 활용 방법</h3>
      ${detailsHTML || '<p>기술을 선택해 주세요.</p>'}
    </div>
  `;
}

// 일반 입력 실시간 반영
['serviceName', 'problem', 'target'].forEach(id => {
  $('#' + id).addEventListener('input', () => {
    saveData();
    renderPreview();
  });
});

// HTML 기획서 다운로드
function downloadHTML() {
  const data = getData();

  const featureHTML = data.features.map((feature, index) => `
    <article>
      <h3>${index + 1}. ${escapeHTML(feature.title)}</h3>
      <p>${escapeHTML(feature.description)}</p>
    </article>
  `).join('');

  const techHTML = data.technologies.map(tech => `
    <article>
      <h3>${escapeHTML(tech.name)}</h3>
      <p>${escapeHTML(tech.description)}</p>
    </article>
  `).join('');

  const documentHTML = `
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHTML(data.serviceName || '프로젝트 기획서')}</title>
<style>
body {
  font-family: Arial, sans-serif;
  max-width: 900px;
  margin: 50px auto;
  padding: 20px;
  color: #302a3c;
  line-height: 1.8;
}
h1 { color: #60438c; }
h2 { color: #60438c; border-bottom: 2px solid #60438c; padding-bottom: 8px; }
article { padding: 12px 0; border-bottom: 1px solid #eee; }
p { white-space: pre-wrap; }
</style>
</head>
<body>
<h1>프로젝트 기획서</h1>
<h2>01. 서비스 이름</h2>
<p>${escapeHTML(data.serviceName)}</p>
<h2>02. 해결하려는 문제</h2>
<p>${escapeHTML(data.problem)}</p>
<h2>03. 주요 대상 사용자</h2>
<p>${escapeHTML(data.target)}</p>
<h2>04. 핵심 기능</h2>
${featureHTML}
<h2>05. 구현 기술</h2>
<p>${data.technologies.map(t => escapeHTML(t.name)).join(', ')}</p>
<h2>06. 기술별 활용 방법</h2>
${techHTML}
</body>
</html>`;

  downloadFile(
    documentHTML,
    'service-plan.html',
    'text/html;charset=utf-8'
  );
}

// JSON 다운로드
function downloadJSON() {
  const json = JSON.stringify(getData(), null, 2);

  downloadFile(
    json,
    'service-plan.json',
    'application/json;charset=utf-8'
  );
}

// 파일 다운로드 공통 함수
function downloadFile(content, filename, type) {
  const blob = new Blob(['\uFEFF' + content], { type });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

// 버튼 이벤트
$('#exportBtn').addEventListener('click', downloadHTML);
$('#downloadJson').addEventListener('click', downloadJSON);

$('#previewBtn').addEventListener('click', () => {
  renderPreview();
  $('#previewContent').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
});

// 저장 데이터 불러오기
function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      renderFeatures();
      renderPreview();
      return;
    }

    const data = JSON.parse(saved);

    $('#serviceName').value = data.serviceName || '';
    $('#problem').value = data.problem || '';
    $('#target').value = data.target || '';

    features = Array.isArray(data.features)
      ? data.features
      : [];

    techDescriptions = {};

    (data.technologies || []).forEach(tech => {
      const input = techInputs.find(item => item.value === tech.name);

      if (input) {
        input.checked = true;
        techDescriptions[tech.name] = tech.description || '';
      }
    });

    renderFeatures();
    renderTechDetails();
    renderPreview();

    $('#saveStatus').textContent = '✓ 저장된 내용 불러오기 완료';

  } catch (error) {
    console.error('저장 데이터 불러오기 실패:', error);
    renderFeatures();
    renderPreview();
  }
}

// 전체 초기화
$('#resetBtn').addEventListener('click', () => {
  if (!confirm('작성한 모든 내용을 초기화할까요?')) return;

  localStorage.removeItem(STORAGE_KEY);

  $('#serviceName').value = '';
  $('#problem').value = '';
  $('#target').value = '';

  techInputs.forEach(input => {
    input.checked = false;
  });

  features = [
    { title: '', description: '' },
    { title: '', description: '' },
    { title: '', description: '' }
  ];

  techDescriptions = {};

  renderFeatures();
  renderTechDetails();
  renderPreview();

  $('#saveStatus').textContent = '새 기획서 작성 중';
});

// 초기 실행
loadData();
