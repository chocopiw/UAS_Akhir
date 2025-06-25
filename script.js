// Global variables
let currentUser = null;
// let users = JSON.parse(localStorage.getItem('users')) || []; // Removed as data will be from server

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupEventListeners();
    setupSidebarNavigation();
    handleHashChange();

    // Sidebar Logout handler
    const sidebarLogout = document.querySelector('.sidebar-link[href="#logout"]');
    if (sidebarLogout) {
        sidebarLogout.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});

// Check authentication status
function checkAuthStatus() {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
        currentUser = JSON.parse(loggedInUser);
        updateNavigation(true);
        showPage('dashboard');
    } else {
        updateNavigation(false);
        showPage('login');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value; // Changed to username
    const password = document.getElementById('loginPassword').value;
    
    // Validate input
    if (!username || !password) {
        showAlert('Mohon isi semua field', 'error');
        return;
    }
    
    try {
        const response = await fetch('api/auth.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'login',
                email: username, // Sending username as email for consistency with backend
                password: password
            })
        });
        
        const data = await response.json();
        
        if(data.success) {
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            updateNavigation(true);
            window.location.hash = '#dashboard';
            showAlert('Login berhasil!', 'success');
            document.getElementById('loginForm').reset();
        } else {
            showAlert(data.error, 'error');
        }
    } catch(error) {
        showAlert('Terjadi kesalahan pada server', 'error');
        console.error('Error during login fetch:', error);
    }
}

// Handle register
async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value; // New: Username field
    const fullname = document.getElementById('registerFullName').value; // New: Full Name field
    const phone = document.getElementById('registerPhone').value; // New: Phone Number field
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const address = document.getElementById('registerAddress').value; // New: Address field
    
    // Client-side validation
    if (!username || !fullname || !phone || !email || !password || !address) {
        showAlert('Mohon isi semua field', 'error');
        return;
    }
    
    // No longer comparing password with confirmPassword as there is no confirmPassword field now in index.html
    // if (password !== confirmPassword) {
    //     showAlert('Password tidak cocok!', 'error');
    //     return;
    // }

    try {
        const response = await fetch('api/auth.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'register',
                username: username,
                fullname: fullname,
                phone: phone,
                email: email,
                password: password,
                address: address
            })
        });
        
        const data = await response.json();
        
        if(data.success) {
            showAlert('Registrasi berhasil! Silakan login.', 'success');
            document.getElementById('registerForm').reset();
            showPage('login');
        } else {
            showAlert(data.error, 'error');
        }
    } catch(error) {
        showAlert('Terjadi kesalahan pada server', 'error');
        console.error('Error during registration fetch:', error);
    }
}

// Show page function
function showPage(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });
    
    // Show selected page
    const selectedPage = document.getElementById(pageName + 'Page');
    if (selectedPage) {
        selectedPage.style.display = 'block';
        
        // Update dashboard if showing dashboard
        if (pageName === 'dashboard' && currentUser) {
            updateDashboard();
        }
    }
}

// Update navigation
function updateNavigation(isLoggedIn) {
    const dashboardLink = document.getElementById('dashboardLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (isLoggedIn) {
        dashboardLink.style.display = 'inline-block';
        logoutLink.style.display = 'inline-block';
    } else {
        dashboardLink.style.display = 'none';
        logoutLink.style.display = 'none';
    }
}

// Update dashboard
function updateDashboard() {
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userEmail').textContent = currentUser.email;
    }
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateNavigation(false);
    showPage('login');
    showAlert('Logout berhasil!', 'success');
}

// Show alert function
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Insert alert at the top of the current page
    const currentPage = document.querySelector('.page[style*="block"]');
    if (currentPage) {
        const firstChild = currentPage.firstElementChild;
        currentPage.insertBefore(alert, firstChild);
        
        // Auto remove alert after 3 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 3000);
    }
}

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Add some sample data for demonstration
// function initializeSampleData() {
//     if (users.length === 0) {
//         const sampleUsers = [
//             {
//                 id: 1,
//                 name: 'Admin User',
//                 email: 'admin@example.com',
//                 password: 'admin123',
//                 createdAt: new Date().toISOString()
//             },
//             {
//                 id: 2,
//                 name: 'Test User',
//                 email: 'test@example.com',
//                 createdAt: new Date().toISOString()
//             }
//         ];
//         
//         users = sampleUsers;
//         localStorage.setItem('users', JSON.stringify(users));
//     }
// }

// Initialize sample data on first load
// if (localStorage.getItem('users') === null) {
//     initializeSampleData();
// } 

function setupSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Hapus class active dari semua link
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            // Tentukan halaman yang akan ditampilkan
            let page = 'dashboard';
            if (this.textContent.trim().toLowerCase().includes('kelola produk')) {
                page = 'kelolaProduk';
            } else if (this.textContent.trim().toLowerCase().includes('dashboard')) {
                page = 'dashboard';
            }
            // Sembunyikan semua .page, tampilkan yang sesuai
            showPage(page);
            // Jika kelola produk, muat data produk
            if (page === 'kelolaProduk') {
                loadProduk();
            }
        });
    });
}

// Fungsi untuk memuat produk dari backend dan tampilkan di grid
async function loadProduk() {
    const grid = document.getElementById('produkGrid');
    grid.innerHTML = '<div>Loading...</div>';
    try {
        const res = await fetch('api/produk.php');
        const data = await res.json();
        if (data.success) {
            if (data.data.length === 0) {
                grid.innerHTML = '<div>Tidak ada produk.</div>';
                return;
            }
            grid.innerHTML = '';
            data.data.forEach(prod => {
                const card = document.createElement('div');
                card.className = 'produk-card';
                card.innerHTML = `
                    <img src="uploads/${prod.gambar}" alt="${prod.nama}" class="produk-img">
                    <div class="produk-info">
                        <div class="produk-nama">${prod.nama}</div>
                        <div class="produk-harga">Rp ${parseInt(prod.harga).toLocaleString()}</div>
                        <div class="produk-stok">Stok: ${prod.stok ?? '-'}</div>
                    </div>
                `;
                grid.appendChild(card);
            });
        } else {
            grid.innerHTML = '<div>Gagal memuat produk.</div>';
        }
    } catch (err) {
        grid.innerHTML = '<div>Gagal memuat produk.</div>';
    }
}

// SPA Hash Navigation
function handleHashChange() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const loggedInUser = localStorage.getItem('currentUser');
    const isLoggedIn = !!loggedInUser;

    // Sembunyikan semua section utama
    document.querySelectorAll('.page, #dashboard, #kelola_produk').forEach(el => {
        if (el) el.style.display = 'none';
    });

    if (!isLoggedIn) {
        // Jika belum login, hanya tampilkan login/register
        if (hash === 'register') {
            const reg = document.getElementById('registerPage');
            if (reg) reg.style.display = 'block';
        } else {
            const login = document.getElementById('loginPage');
            if (login) login.style.display = 'block';
        }
    } else {
        // Jika sudah login, tampilkan dashboard/kelola produk sesuai hash
        if (hash === 'dashboard' || hash === 'kelola_produk') {
            const section = document.getElementById(hash);
            if (section) section.style.display = 'block';
        } else {
            // Default ke dashboard jika hash tidak dikenal
            const dashboard = document.getElementById('dashboard');
            if (dashboard) dashboard.style.display = 'block';
        }
    }

    // Efek aktif pada menu sidebar
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + hash) {
            link.classList.add('active');
        }
    });
}
window.addEventListener('hashchange', handleHashChange);
window.addEventListener('DOMContentLoaded', handleHashChange); 