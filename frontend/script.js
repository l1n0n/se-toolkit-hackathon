const API_URL = '/api/contacts';
const AUTH_URL = '/api/auth';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        fetchCurrentUser();
    } else {
        showAuthPage();
    }
}

function showAuthPage() {
    document.getElementById('authPage').style.display = 'block';
    document.getElementById('mainApp').style.display = 'none';
}

function showMainApp() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    loadContacts();
    
    document.getElementById('addContactForm').addEventListener('submit', addContact);
    document.getElementById('searchInput').addEventListener('input', searchContacts);
}

function showLoginForm() {
    document.querySelectorAll('.auth-tab')[0].classList.add('active');
    document.querySelectorAll('.auth-tab')[1].classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
    
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginError').innerHTML = '';
}

function showRegisterForm() {
    document.querySelectorAll('.auth-tab')[1].classList.add('active');
    document.querySelectorAll('.auth-tab')[0].classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
    
    document.getElementById('registerUsername').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('registerPasswordConfirm').value = '';
    document.getElementById('registerError').innerHTML = '';
    document.getElementById('registerSuccess').innerHTML = '';
}

async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${AUTH_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            
            document.getElementById('loginUsername').value = '';
            document.getElementById('loginPassword').value = '';
            document.getElementById('loginError').innerHTML = '';
            
            fetchCurrentUser();
        } else {
            const error = await response.json();
            document.getElementById('loginError').innerHTML = 
                `<div class="error-message">${error.detail}</div>`;
        }
    } catch (error) {
        console.error('Error logging in:', error);
        document.getElementById('loginError').innerHTML = 
            '<div class="error-message">Ошибка подключения</div>';
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    
    document.getElementById('registerError').innerHTML = '';
    document.getElementById('registerSuccess').innerHTML = '';
    
    if (password !== passwordConfirm) {
        document.getElementById('registerError').innerHTML = 
            '<div class="error-message">Пароли не совпадают</div>';
        return;
    }
    
    try {
        const response = await fetch(`${AUTH_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            document.getElementById('registerSuccess').innerHTML = 
                '<div class="success-message">Регистрация успешна! Теперь войдите.</div>';
            
            document.getElementById('registerUsername').value = '';
            document.getElementById('registerPassword').value = '';
            document.getElementById('registerPasswordConfirm').value = '';
            
            setTimeout(() => {
                showLoginForm();
            }, 1000);
        } else {
            const error = await response.json();
            document.getElementById('registerError').innerHTML = 
                `<div class="error-message">${error.detail}</div>`;
        }
    } catch (error) {
        console.error('Error registering:', error);
        document.getElementById('registerError').innerHTML = 
            '<div class="error-message">Ошибка подключения</div>';
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    showAuthPage();
}

async function fetchCurrentUser() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${AUTH_URL}/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const user = await response.json();
            document.getElementById('currentUser').textContent = user.username;
            showMainApp();
        } else {
            localStorage.removeItem('token');
            showAuthPage();
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token');
        showAuthPage();
    }
}

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

async function loadContacts() {
    try {
        const response = await fetch(API_URL, {
            headers: getAuthHeaders()
        });
        const contacts = await response.json();
        displayContacts(contacts);
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

async function addContact(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name, phone, email })
        });

        if (response.ok) {
            document.getElementById('addContactForm').reset();
            loadContacts();
        }
    } catch (error) {
        console.error('Error adding contact:', error);
    }
}

async function searchContacts() {
    const query = document.getElementById('searchInput').value;

    if (!query) {
        loadContacts();
        return;
    }

    try {
        const response = await fetch(`${API_URL}?search=${encodeURIComponent(query)}`, {
            headers: getAuthHeaders()
        });
        const contacts = await response.json();
        displayContacts(contacts);
    } catch (error) {
        console.error('Error searching contacts:', error);
    }
}

function displayContacts(contacts) {
    const container = document.getElementById('contactsList');

    if (contacts.length === 0) {
        container.innerHTML = '<p class="empty-message">No contacts found.</p>';
        return;
    }

    container.innerHTML = contacts.map(contact => `
        <div class="contact-item">
            <div class="contact-info">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-details">📞 ${contact.phone} | ✉️ ${contact.email}</div>
            </div>
        </div>
    `).join('');
}
