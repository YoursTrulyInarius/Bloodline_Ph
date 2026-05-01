// =============================================
// DATA HELPERS (localStorage — no hardcoded defaults)
// =============================================
function getRequests() {
    return JSON.parse(localStorage.getItem('bloodline_requests') || '[]');
}

function getDonors() {
    return JSON.parse(localStorage.getItem('bloodline_donors') || '[]');
}

function saveRequests(data) {
    localStorage.setItem('bloodline_requests', JSON.stringify(data));
}

function saveDonors(data) {
    localStorage.setItem('bloodline_donors', JSON.stringify(data));
}

// =============================================
// TIME HELPER
// =============================================
function timeAgo(time) {
    const seconds = Math.floor((Date.now() - time) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

// =============================================
// EMPTY STATE
// =============================================
function emptyStateHTML(icon, message) {
    return `
        <div class="empty-state">
            <div class="empty-icon">${icon}</div>
            <p>${message}</p>
        </div>`;
}

// =============================================
// CARD TEMPLATES
// =============================================
function requestCardHTML(req) {
    return `
        <div class="request-card" id="${req.id}">
            <div class="req-info">
                <h3>${req.patient}</h3>
                <div class="city-badge">📍 ${req.city}</div>
                <div class="req-details">
                    <span>🏥 ${req.hospital}</span>
                    <span class="time-stamp" data-time="${req.timestamp}">⏱️ ${timeAgo(req.timestamp)}</span>
                </div>
                <a href="tel:${req.contact}" class="contact-btn">📞 ${req.contact}</a>
            </div>
            <div class="blood-badge">${req.bloodType}</div>
        </div>`;
}

function donorCardHTML(donor) {
    return `
        <div class="request-card" id="${donor.id}">
            <div class="req-info">
                <h3>${donor.name}</h3>
                <div class="city-badge">📍 ${donor.city}</div>
                <div class="req-details">
                    <span class="time-stamp" data-time="${donor.timestamp}">⏱️ Registered ${timeAgo(donor.timestamp)}</span>
                </div>
                <a href="tel:${donor.contact}" class="contact-btn">📞 ${donor.contact}</a>
            </div>
            <div class="blood-badge">${donor.bloodType}</div>
        </div>`;
}

function bankCardHTML(bank) {
    return `
        <div class="request-card">
            <div class="req-info">
                <h3>${bank.name}</h3>
                <div class="city-badge">📍 ${bank.city}</div>
                <div class="req-details">
                    <span>🕐 ${bank.hours}</span>
                    <span>📞 ${bank.contact}</span>
                </div>
            </div>
            <div class="blood-badge bank-icon">🏥</div>
        </div>`;
}

// =============================================
// PAGE RENDERERS
// =============================================
function renderUrgentFeed() {
    const feed = document.getElementById('requestsFeed');
    if (!feed) return;
    const requests = getRequests().sort((a, b) => b.timestamp - a.timestamp);
    feed.innerHTML = requests.length
        ? requests.map(requestCardHTML).join('')
        : emptyStateHTML('🩸', 'No urgent requests yet.<br>Be the first to post one using the form.');
}

function renderDonorFeed() {
    const feed = document.getElementById('donorFeed');
    if (!feed) return;
    const donors = getDonors().sort((a, b) => b.timestamp - a.timestamp);
    feed.innerHTML = donors.length
        ? donors.map(donorCardHTML).join('')
        : emptyStateHTML('🙋', 'No donors registered yet.<br>Sign up to help save a life!');
}

function renderBanks() {
    const list = document.getElementById('banksList');
    if (!list) return;

    // Real Philippine Blood Banks — reference data, not mock data
    const banks = [
        { name: "Philippine Blood Center", city: "Quezon City", hours: "Open 24/7", contact: "(02) 8927-4413" },
        { name: "Philippine General Hospital Blood Bank", city: "Manila", hours: "Mon–Sun, 8AM–5PM", contact: "(02) 8554-8400" },
        { name: "St. Luke's Medical Center Blood Center", city: "Quezon City", hours: "Mon–Sat, 7AM–7PM", contact: "(02) 8789-7700" },
        { name: "Philippine Red Cross Blood Services", city: "Manila", hours: "Mon–Fri, 8AM–5PM", contact: "(02) 8527-0000" },
        { name: "National Kidney & Transplant Institute Blood Bank", city: "Quezon City", hours: "Open 24/7", contact: "(02) 8981-0300" },
        { name: "Vicente Sotto Memorial Medical Center Blood Bank", city: "Cebu City", hours: "Open 24/7", contact: "(032) 253-9891" },
        { name: "Davao Regional Medical Center Blood Bank", city: "Davao City", hours: "Open 24/7", contact: "(082) 227-2731" },
        { name: "Baguio General Hospital Blood Bank", city: "Baguio City", hours: "Mon–Sun, 8AM–4PM", contact: "(074) 442-3420" }
    ];

    list.innerHTML = banks.map(bankCardHTML).join('');
}

function renderSearchResults(donors) {
    const results = document.getElementById('searchResults');
    if (!results) return;
    results.innerHTML = donors.length
        ? donors.map(donorCardHTML).join('')
        : emptyStateHTML('🔍', 'No donors found matching your search.<br>Try a different blood type or city.');
}

// =============================================
// SPA NAVIGATION
// =============================================
function navigate(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });
    document.querySelectorAll('.page').forEach(p => {
        p.classList.toggle('active', p.id === `page-${page}`);
    });

    if (page === 'urgent') renderUrgentFeed();
    if (page === 'donate') renderDonorFeed();
    if (page === 'banks') renderBanks();
    if (page === 'find') renderSearchResults(getDonors());
}

// =============================================
// HAMBURGER MENU (Mobile)
// =============================================
function openSidebar() {
    document.querySelector('.sidebar').classList.add('open');
    document.getElementById('overlay').classList.add('visible');
    document.getElementById('hamburgerBtn').classList.add('open');
}

function closeSidebar() {
    document.querySelector('.sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('visible');
    document.getElementById('hamburgerBtn').classList.remove('open');
}

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {

    // --- HAMBURGER MENU TOGGLE ---
    document.getElementById('hamburgerBtn').addEventListener('click', () => {
        document.querySelector('.sidebar').classList.contains('open')
            ? closeSidebar()
            : openSidebar();
    });
    document.getElementById('overlay').addEventListener('click', closeSidebar);

    // Wire up nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(link.dataset.page);
            closeSidebar(); // auto-close on mobile after nav
        });
    });

    // Default page on load
    navigate('urgent');

    // --- URGENT REQUEST FORM ---
    document.getElementById('requestForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newRequest = {
            id: 'req-' + Date.now(),
            patient: document.getElementById('patientName').value.trim(),
            bloodType: document.getElementById('bloodType').value,
            city: document.getElementById('city').value.trim(),
            hospital: document.getElementById('hospital').value.trim(),
            contact: document.getElementById('contact').value.trim(),
            timestamp: Date.now()
        };
        const requests = getRequests();
        requests.push(newRequest);
        saveRequests(requests);
        renderUrgentFeed();
        e.target.reset();
    });

    // --- DONOR REGISTRATION FORM ---
    document.getElementById('donorForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newDonor = {
            id: 'don-' + Date.now(),
            name: document.getElementById('donorName').value.trim(),
            bloodType: document.getElementById('donorBlood').value,
            city: document.getElementById('donorCity').value.trim(),
            contact: document.getElementById('donorContact').value.trim(),
            timestamp: Date.now()
        };
        const donors = getDonors();
        donors.push(newDonor);
        saveDonors(donors);
        renderDonorFeed();
        e.target.reset();
    });

    // --- FIND MATCH SEARCH ---
    document.getElementById('searchBtn').addEventListener('click', () => {
        const bloodFilter = document.getElementById('searchBlood').value;
        const cityFilter = document.getElementById('searchCity').value.toLowerCase().trim();
        let donors = getDonors();
        if (bloodFilter) donors = donors.filter(d => d.bloodType === bloodFilter);
        if (cityFilter) donors = donors.filter(d => d.city.toLowerCase().includes(cityFilter));
        renderSearchResults(donors);
    });

    // --- REAL-TIME CROSS-TAB SYNC (localStorage events) ---
    window.addEventListener('storage', (e) => {
        if (e.key === 'bloodline_requests') renderUrgentFeed();
        if (e.key === 'bloodline_donors') {
            renderDonorFeed();
            // Also refresh find-match results if it's the active page
            if (document.getElementById('page-find').classList.contains('active')) {
                renderSearchResults(getDonors());
            }
        }
    });

    // --- AUTO-UPDATE TIMESTAMPS EVERY MINUTE ---
    setInterval(() => {
        document.querySelectorAll('.time-stamp').forEach(el => {
            const time = parseInt(el.getAttribute('data-time'));
            el.innerHTML = `⏱️ ${timeAgo(time)}`;
        });
    }, 60000);
});
