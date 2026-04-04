const API_URL = '/api/contacts';

// Загрузка контактов при старте
document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    
    // Обработчик формы добавления
    document.getElementById('addContactForm').addEventListener('submit', addContact);
    
    // Обработчик поиска
    document.getElementById('searchInput').addEventListener('input', searchContacts);
});

// Загрузить все контакты
async function loadContacts() {
    try {
        const response = await fetch(API_URL);
        const contacts = await response.json();
        displayContacts(contacts);
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

// Добавить контакт
async function addContact(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, phone, email })
        });
        
        if (response.ok) {
            // Очистить форму
            document.getElementById('addContactForm').reset();
            // Перезагрузить контакты
            loadContacts();
        }
    } catch (error) {
        console.error('Error adding contact:', error);
    }
}

// Поиск контактов
async function searchContacts() {
    const query = document.getElementById('searchInput').value;
    
    if (!query) {
        loadContacts();
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}?search=${encodeURIComponent(query)}`);
        const contacts = await response.json();
        displayContacts(contacts);
    } catch (error) {
        console.error('Error searching contacts:', error);
    }
}

// Отобразить контакты
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
