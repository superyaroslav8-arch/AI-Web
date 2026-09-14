// AI Web - Premium Link Creator

// DOM Elements
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const generateBtn = document.getElementById('generateBtn');
const result = document.getElementById('result');
const generatedLink = document.getElementById('generatedLink');
const copyBtn = document.getElementById('copyBtn');
const customSlug = document.getElementById('customSlug');
const slugInput = document.getElementById('slugInput');
const toast = document.getElementById('toast');

// Auth elements
const authModal = document.getElementById('authModal');
const registerModal = document.getElementById('registerModal');
const openAuth = document.getElementById('openAuth');
const openRegister = document.getElementById('openRegister');
const openAuthMobile = document.getElementById('openAuthMobile');
const openRegisterMobile = document.getElementById('openRegisterMobile');
const closeAuth = document.getElementById('closeAuth');
const closeRegister = document.getElementById('closeRegister');
const switchToRegister = document.getElementById('switchToRegister');
const switchToAuth = document.getElementById('switchToAuth');
const authForm = document.getElementById('authForm');
const registerForm = document.getElementById('registerForm');
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

// Current tab
let currentTab = 'url';

// Tabs
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        currentTab = tab.dataset.tab;
        document.getElementById(`tab-${currentTab}`).classList.add('active');
        result.hidden = true;
    });
});

// Custom slug toggle
customSlug.addEventListener('change', () => {
    slugInput.hidden = !customSlug.checked;
    if (customSlug.checked) slugInput.focus();
});

// Upload zones
function setupUpload(zoneId, inputId, previewId, isVideo = false, isFile = false) {
    const zone = document.getElementById(zoneId);
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    zone.addEventListener('click', () => input.click());

    zone.addEventListener('dragover', e => {
        e.preventDefault();
        zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));

    zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            input.files = e.dataTransfer.files;
            handleFile(input, preview, isVideo, isFile);
        }
    });

    input.addEventListener('change', () => handleFile(input, preview, isVideo, isFile));
}

function handleFile(input, preview, isVideo, isFile) {
    const file = input.files[0];
    if (!file) return;

    const placeholder = preview.previousElementSibling || preview.parentElement.querySelector('.upload-placeholder');

    if (isFile) {
        preview.hidden = false;
        if (placeholder) placeholder.hidden = true;
        preview.innerHTML = `<strong>${file.name}</strong><br><span style="color:var(--text-muted)">${(file.size / 1024 / 1024).toFixed(2)} МБ</span>`;
        return;
    }

    const reader = new FileReader();
    reader.onload = e => {
        preview.src = e.target.result;
        preview.hidden = false;
        if (placeholder) placeholder.hidden = true;
    };
    reader.readAsDataURL(file);
}

setupUpload('photoZone', 'photoInput', 'photoPreview');
setupUpload('videoZone', 'videoInput', 'videoPreview', true);
setupUpload('fileZone', 'fileInput', 'fileInfo', false, true);

// Generate link
generateBtn.addEventListener('click', () => {
    let data = null;
    let type = currentTab;

    if (currentTab === 'url') {
        const url = document.getElementById('urlInput').value.trim();
        if (!url) {
            showToast('Вставь URL');
            return;
        }
        data = url;
    } else if (currentTab === 'photo') {
        const input = document.getElementById('photoInput');
        if (!input.files[0]) {
            showToast('Загрузи фото');
            return;
        }
        data = input.files[0].name;
    } else if (currentTab === 'video') {
        const input = document.getElementById('videoInput');
        if (!input.files[0]) {
            showToast('Загрузи видео');
            return;
        }
        data = input.files[0].name;
    } else if (currentTab === 'file') {
        const input = document.getElementById('fileInput');
        if (!input.files[0]) {
            showToast('Загрузи файл');
            return;
        }
        data = input.files[0].name;
    }

    // Generate slug
    let slug = customSlug.checked && slugInput.value.trim()
        ? slugInput.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
        : generateRandomSlug();

    const link = `https://aiweb.app/l/${slug}`;

    // Store in localStorage (demo)
    const links = JSON.parse(localStorage.getItem('aiweb_links') || '[]');
    links.push({
        slug,
        type,
        data,
        created: new Date().toISOString()
    });
    localStorage.setItem('aiweb_links', JSON.stringify(links));

    // Show result
    generatedLink.value = link;
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast('Ссылка создана! ✨');
});

function generateRandomSlug() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

// Copy
copyBtn.addEventListener('click', () => {
    generatedLink.select();
    navigator.clipboard.writeText(generatedLink.value).then(() => {
        showToast('Скопировано в буфер!');
        copyBtn.textContent = 'Скопировано!';
        setTimeout(() => copyBtn.textContent = 'Копировать', 2000);
    });
});

// Toast
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Auth modals
function openModal(modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

openAuth.addEventListener('click', () => openModal(authModal));
openRegister.addEventListener('click', () => openModal(registerModal));
openAuthMobile.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    openModal(authModal);
});
openRegisterMobile.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    openModal(registerModal);
});

closeAuth.addEventListener('click', () => closeModal(authModal));
closeRegister.addEventListener('click', () => closeModal(registerModal));

authModal.querySelector('.modal-backdrop').addEventListener('click', () => closeModal(authModal));
registerModal.querySelector('.modal-backdrop').addEventListener('click', () => closeModal(registerModal));

switchToRegister.addEventListener('click', e => {
    e.preventDefault();
    closeModal(authModal);
    openModal(registerModal);
});

switchToAuth.addEventListener('click', e => {
    e.preventDefault();
    closeModal(registerModal);
    openModal(authModal);
});

// Auth forms (no real checks, as requested)
authForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Успешный вход! 👋');
    closeModal(authModal);
    localStorage.setItem('aiweb_user', 'logged_in');
});

registerForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Аккаунт создан! Добро пожаловать 🎉');
    closeModal(registerModal);
    localStorage.setItem('aiweb_user', 'logged_in');
});

// Burger menu
burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Keyboard close modal
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeModal(authModal);
        closeModal(registerModal);
    }
});
