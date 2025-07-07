// Hardcoded admin user untuk testing
const ADMIN_USER = {
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    email: 'admin@example.com'
};

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

    // Navbar Login handler
    const navbarLogin = document.querySelector('.nav-link[href="#login"]');
    if (navbarLogin) {
        navbarLogin.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.hash = '#login';
            setTimeout(() => {
                const input = document.getElementById('loginUsername');
                if (input) input.focus();
            }, 100);
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            if (username === 'admin' && password === 'admin123') {
                document.getElementById('loginPage').style.display = 'none';
                document.getElementById('dashboard').style.display = 'block';
            } else {
                alert('Username atau password salah!');
            }
        });
    }

    // Sidebar navigation
    const kelolaProdukMenu = document.getElementById('kelolaProdukMenu');
    if (kelolaProdukMenu) {
        kelolaProdukMenu.addEventListener('click', function(e) {
            e.preventDefault();
            showPage('kelolaProdukPage');
            setActiveSidebar('kelolaProdukMenu');
        });
    }
    const penggunaMenu = document.getElementById('penggunaMenu');
    if (penggunaMenu) {
        penggunaMenu.addEventListener('click', function(e) {
            e.preventDefault();
            showPage('penggunaPage');
            setActiveSidebar('penggunaMenu');
        });
    }
    const logoutMenu = document.getElementById('logoutMenu');
    if (logoutMenu) {
        logoutMenu.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }

    // Modal Tambah Produk (Kelola Produk)
    var btnShowTambah = document.getElementById('btnShowTambahProduk');
    var modalTambah = document.getElementById('modalTambahProduk');
    var closeModalTambah = document.getElementById('closeModalTambah');

    if (btnShowTambah && modalTambah) {
        btnShowTambah.onclick = function() {
            modalTambah.style.display = 'flex';
        };
    }
    if (closeModalTambah && modalTambah) {
        closeModalTambah.onclick = function() {
            modalTambah.style.display = 'none';
        };
    }
    window.onclick = function(event) {
        if (event.target === modalTambah) {
            modalTambah.style.display = 'none';
        }
    };
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
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!username || !password) {
        showPopup('Mohon isi username dan password');
        return;
    }
    
    // Check against hardcoded admin credentials
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
        currentUser = ADMIN_USER;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateNavigation(true);
        window.location.hash = '#dashboard';
        handleHashChange();
        showPopup('Login berhasil!');
    } else {
        showPopup('Username atau password salah!');
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
            showPopup('Registrasi berhasil! Silakan login.');
            document.getElementById('registerForm').reset();
            showPage('login');
        } else {
            showPopup(data.error);
        }
    } catch(error) {
        showPopup('Terjadi kesalahan pada server');
        console.error('Error during registration fetch:', error);
    }
}

// Show page function
function showPage(pageName) {
    // Sembunyikan semua page utama
    const pages = document.querySelectorAll('.main-content > div');
    pages.forEach(page => page.style.display = 'none');
    // Tampilkan page yang dipilih
    const page = document.getElementById(pageName);
    if (page) page.style.display = 'block';
}

// Update navigation
function updateNavigation(isLoggedIn) {
    const loginLink = document.getElementById('loginLink');
    const kelolaProdukLink = document.getElementById('kelolaProdukLink');
    
    if (isLoggedIn) {
        loginLink.style.display = 'none';
        kelolaProdukLink.style.display = 'inline-block';
    } else {
        loginLink.style.display = 'inline-block';
        kelolaProdukLink.style.display = 'none';
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
    window.location.hash = '#login';
    handleHashChange();
    showPopup('Logout berhasil!');
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
                // loadProducts();
            }
        });
    });
}

// SPA Hash Navigation
function handleHashChange() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const isLoggedIn = !!currentUser;

    // Sembunyikan semua section utama
    document.querySelectorAll('.page, #dashboard, #kelola_produk').forEach(el => {
        if (el) el.style.display = 'none';
    });

    if (!isLoggedIn) {
        // Jika belum login, tampilkan login
        const login = document.getElementById('loginPage');
        if (login) login.style.display = 'block';
    } else {
        // Jika sudah login, tampilkan dashboard/kelola produk sesuai hash
        if (hash === 'dashboard' || hash === 'kelola_produk') {
            const section = document.getElementById(hash);
            if (section) section.style.display = 'block';
        } else {
            // Default ke dashboard
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

function showPopup(message) {
    const popup = document.getElementById('popupNotif');
    const msg = document.getElementById('popupNotifMsg');
    if (popup && msg) {
        msg.textContent = message;
        popup.style.display = 'flex';
    } else {
        alert(message);
    }
}

function showLogin() {
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('registerPage').style.display = 'none';
}

function showRegister() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('registerPage').style.display = 'block';
}

// Product Management
let products = [];
const modal = document.getElementById('productModal');
const modalTitle = document.getElementById('modalTitle');
const productForm = document.getElementById('productForm');
const closeBtn = document.querySelector('.close');
let editingProductId = null;

// Close modal when clicking the close button or outside the modal
if (closeBtn) {
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Show add product form
function showAddProductForm() {
    modalTitle.textContent = 'Tambah Produk';
    productForm.reset();
    editingProductId = null;
    modal.style.display = "block";
}

// Format price with thousand separator
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price);
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    modalTitle.textContent = 'Edit Produk';
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    editingProductId = id;
    modal.style.display = "block";
}

// Delete product
function deleteProduct(id) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        fetch(`api/produk.php?id=${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadProducts();
            } else {
                alert('Gagal menghapus produk');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

// Handle form submission
if (productForm) {
    productForm.onsubmit = function(e) {
        e.preventDefault();
        
        const formData = new FormData(productForm);
        const method = editingProductId ? 'PUT' : 'POST';
        if (editingProductId) {
            formData.append('id', editingProductId);
        }

        fetch('api/produk.php', {
            method: method,
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                modal.style.display = "none";
                // loadProducts();
                productForm.reset();
            } else {
                alert('Gagal menyimpan produk');
            }
        })
        .catch(error => console.error('Error:', error));
    };
}

function setActiveSidebar(menuId) {
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    sidebarLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.getElementById(menuId);
    if (activeLink) activeLink.classList.add('active');
}

// Fungsi untuk mengambil dan menampilkan produk
function loadProducts() {
    const produkGrid = document.getElementById('produkGrid');
    produkGrid.innerHTML = '<div>Loading...</div>';
    fetch('api/produk.php')
        .then(response => response.json())
        .then(data => {
            produkGrid.innerHTML = '';
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(produk => {
                    const card = document.createElement('div');
                    card.className = 'produk-card';
                    card.innerHTML = `
                        <img src="${produk.image ? produk.image : 'https://via.placeholder.com/80'}" alt="${produk.name}" class="produk-img">
                        <div class="produk-nama">${produk.name}</div>
                        <div class="produk-harga">Rp ${Number(produk.price).toLocaleString('id-ID')}</div>
                        <button class="btn btn-danger btn-hapus-produk" data-id="${produk.id}" style="margin-top:10px;">Hapus</button>
                    `;
                    produkGrid.appendChild(card);
                });
                // Tambahkan event listener untuk tombol hapus
                const hapusButtons = document.querySelectorAll('.btn-hapus-produk');
                hapusButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        deleteProduct(id);
                    });
                });
            } else {
                produkGrid.innerHTML = '<div>Tidak ada produk.</div>';
            }
        })
        .catch(err => {
            produkGrid.innerHTML = '<div>Gagal memuat produk.</div>';
        });
}

// Panggil loadProducts saat halaman dimuat
window.addEventListener('DOMContentLoaded', loadProducts);

// Setelah submit produk, panggil loadProducts
const formTambahProduk = document.getElementById('formTambahProduk');
if (formTambahProduk) {
    formTambahProduk.onsubmit = function(e) {
        e.preventDefault();
        const formData = new FormData(formTambahProduk);
        fetch('api/produk.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('modalTambahProduk').style.display = 'none';
                formTambahProduk.reset();
                loadProducts();
            } else {
                alert('Gagal menyimpan produk');
            }
        })
        .catch(error => alert('Gagal menyimpan produk'));
    };
}

function showPageByHash() {
    const hash = window.location.hash.replace('#', '');
    // Sembunyikan semua page
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    if (hash === 'dashboard') {
        // Tampilkan dashboard user
        const userDashboard = document.getElementById('userDashboard');
        if (userDashboard) userDashboard.style.display = 'block';
    } else if (hash === 'kelola_produk') {
        const kelolaProduk = document.getElementById('kelola_produk');
        if (kelolaProduk) kelolaProduk.style.display = 'block';
    } else if (hash === 'login' || hash === '') {
        const loginPage = document.getElementById('loginPage');
        if (loginPage) loginPage.style.display = 'block';
    } else if (hash === 'register') {
        const registerPage = document.getElementById('registerPage');
        if (registerPage) registerPage.style.display = 'block';
    } else {
        // Default ke login
        const loginPage = document.getElementById('loginPage');
        if (loginPage) loginPage.style.display = 'block';
    }
}
window.addEventListener('hashchange', showPageByHash);
window.addEventListener('DOMContentLoaded', showPageByHash);

// Pelayanan Management
let pelayanan = [];

// Initialize pelayanan functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load pelayanan if on pelayanan page
    if (window.location.pathname.includes('pelayanan.html') || document.getElementById('pelayananGrid')) {
        loadPelayanan();
        setupPelayananEventListeners();
    }
});

function setupPelayananEventListeners() {
    // Modal Tambah Pelayanan
    const btnShowTambahPelayanan = document.getElementById('btnShowTambahPelayanan');
    const modalTambahPelayanan = document.getElementById('modalTambahPelayanan');
    const closeModalTambahPelayanan = document.getElementById('closeModalTambahPelayanan');
    const btnBatalTambahPelayanan = document.getElementById('btnBatalTambahPelayanan');

    if (btnShowTambahPelayanan && modalTambahPelayanan) {
        btnShowTambahPelayanan.onclick = function() {
            modalTambahPelayanan.style.display = 'flex';
        };
    }

    if (closeModalTambahPelayanan && modalTambahPelayanan) {
        closeModalTambahPelayanan.onclick = function() {
            modalTambahPelayanan.style.display = 'none';
        };
    }

    if (btnBatalTambahPelayanan && modalTambahPelayanan) {
        btnBatalTambahPelayanan.onclick = function() {
            modalTambahPelayanan.style.display = 'none';
        };
    }

    // Modal Edit Pelayanan
    const modalEditPelayanan = document.getElementById('modalEditPelayanan');
    const closeModalEditPelayanan = document.getElementById('closeModalEditPelayanan');
    const btnBatalEditPelayanan = document.getElementById('btnBatalEditPelayanan');

    if (closeModalEditPelayanan && modalEditPelayanan) {
        closeModalEditPelayanan.onclick = function() {
            modalEditPelayanan.style.display = 'none';
        };
    }

    if (btnBatalEditPelayanan && modalEditPelayanan) {
        btnBatalEditPelayanan.onclick = function() {
            modalEditPelayanan.style.display = 'none';
        };
    }

    // Close modals when clicking outside
    window.onclick = function(event) {
        if (event.target === modalTambahPelayanan) {
            modalTambahPelayanan.style.display = 'none';
        }
        if (event.target === modalEditPelayanan) {
            modalEditPelayanan.style.display = 'none';
        }
    };

    // Form submissions
    const formTambahPelayanan = document.getElementById('formTambahPelayanan');
    if (formTambahPelayanan) {
        formTambahPelayanan.addEventListener('submit', handleTambahPelayanan);
    }

    const formEditPelayanan = document.getElementById('formEditPelayanan');
    if (formEditPelayanan) {
        formEditPelayanan.addEventListener('submit', handleEditPelayanan);
    }
}

// Load pelayanan from API
function loadPelayanan() {
    const pelayananGrid = document.getElementById('pelayananGrid');
    if (!pelayananGrid) return;

    pelayananGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: #666;">Loading pelayanan...</div>';

    fetch('api/pelayanan.php')
        .then(response => response.json())
        .then(data => {
            if (data.success && Array.isArray(data.data)) {
                pelayanan = data.data;
                displayPelayanan(pelayanan);
            } else {
                pelayananGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: #666;">Tidak ada pelayanan tersedia.</div>';
            }
        })
        .catch(error => {
            console.error('Error loading pelayanan:', error);
            pelayananGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: #f44336;">Gagal memuat pelayanan.</div>';
        });
}

// Display pelayanan in grid
function displayPelayanan(pelayananList) {
    const pelayananGrid = document.getElementById('pelayananGrid');
    if (!pelayananGrid) return;

    pelayananGrid.innerHTML = '';

    if (pelayananList.length === 0) {
        pelayananGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: #666;">Tidak ada pelayanan tersedia.</div>';
        return;
    }

    pelayananList.forEach(item => {
        const card = document.createElement('div');
        card.className = 'pelayanan-card';
        card.innerHTML = `
            <div class="pelayanan-header">
                <div class="pelayanan-status ${item.status}">${item.status}</div>
                <div class="pelayanan-nama">${item.nama_pelayanan}</div>
                <div class="pelayanan-harga">Rp ${formatPrice(item.harga)}</div>
                <div class="pelayanan-durasi">
                    <i class="fas fa-clock"></i>
                    ${item.durasi} menit
                </div>
            </div>
            <div class="pelayanan-body">
                <div class="pelayanan-deskripsi">${item.deskripsi || 'Tidak ada deskripsi'}</div>
                <div class="pelayanan-actions">
                    <button class="pelayanan-btn edit" onclick="editPelayanan(${item.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="pelayanan-btn delete" onclick="deletePelayanan(${item.id})">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </div>
        `;
        pelayananGrid.appendChild(card);
    });
}

// Handle tambah pelayanan
async function handleTambahPelayanan(e) {
    e.preventDefault();

    const formData = {
        action: 'create',
        nama_pelayanan: document.getElementById('namaPelayanan').value,
        deskripsi: document.getElementById('deskripsiPelayanan').value,
        harga: parseFloat(document.getElementById('hargaPelayanan').value),
        durasi: parseInt(document.getElementById('durasiPelayanan').value),
        status: document.getElementById('statusPelayanan').value
    };

    try {
        const response = await fetch('api/pelayanan.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            showPopup('Pelayanan berhasil ditambahkan!');
            document.getElementById('modalTambahPelayanan').style.display = 'none';
            document.getElementById('formTambahPelayanan').reset();
            loadPelayanan();
        } else {
            showPopup('Gagal menambahkan pelayanan: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        showPopup('Gagal menambahkan pelayanan');
    }
}

// Handle edit pelayanan
async function handleEditPelayanan(e) {
    e.preventDefault();

    const formData = {
        id: parseInt(document.getElementById('editIdPelayanan').value),
        nama_pelayanan: document.getElementById('editNamaPelayanan').value,
        deskripsi: document.getElementById('editDeskripsiPelayanan').value,
        harga: parseFloat(document.getElementById('editHargaPelayanan').value),
        durasi: parseInt(document.getElementById('editDurasiPelayanan').value),
        status: document.getElementById('editStatusPelayanan').value
    };

    try {
        const response = await fetch('api/pelayanan.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            showPopup('Pelayanan berhasil diperbarui!');
            document.getElementById('modalEditPelayanan').style.display = 'none';
            loadPelayanan();
        } else {
            showPopup('Gagal memperbarui pelayanan: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        showPopup('Gagal memperbarui pelayanan');
    }
}

// Edit pelayanan
function editPelayanan(id) {
    const item = pelayanan.find(p => p.id === id);
    if (!item) return;

    document.getElementById('editIdPelayanan').value = item.id;
    document.getElementById('editNamaPelayanan').value = item.nama_pelayanan;
    document.getElementById('editDeskripsiPelayanan').value = item.deskripsi || '';
    document.getElementById('editHargaPelayanan').value = item.harga;
    document.getElementById('editDurasiPelayanan').value = item.durasi;
    document.getElementById('editStatusPelayanan').value = item.status;

    document.getElementById('modalEditPelayanan').style.display = 'flex';
}

// Delete pelayanan
function deletePelayanan(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus pelayanan ini?')) {
        return;
    }

    fetch('api/pelayanan.php', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showPopup('Pelayanan berhasil dihapus!');
            loadPelayanan();
        } else {
            showPopup('Gagal menghapus pelayanan: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showPopup('Gagal menghapus pelayanan');
    });
} 