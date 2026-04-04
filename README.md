# ContactHub

A web-based phone book application for storing, searching, and managing personal contacts.

## Demo

![ContactHub Demo](demo.png)

*Add, search, and manage your contacts in one place*

## Product Context

**End user:** All people who need to store and manage contacts in one place

**Problem:** Contacts are scattered across different services (phone, social media, messengers), making it difficult to find and manage them centrally

**Your solution:** A simple web application where users can quickly add new contacts and search existing ones.

## Features

### Version 1 (Lab Demo)
- ✅ Add new contact (name, phone, email)
- ✅ Search existing contacts by name, phone, or email
- ✅ Clean and responsive web UI
- ✅ Real-time search as you type

### Version 2 (Deployed)
- ✅ Docker containerization
- ✅ Persistent data storage
- ✅ Deployment-ready for any VM
- ✅ Full documentation

## Usage

### Quick Start (Docker)

```bash
# Clone the repository
git clone https://github.com/l1n0n/se-toolkit-hackathon.git
cd se-toolkit-hackathon

# Start the application
docker-compose up -d

# Open in browser
# http://localhost:8000
```

### How to Use

1. **Add a contact:**
   - Fill in the name, phone, and email fields
   - Click "Add Contact" button
   - Contact appears in the list below

2. **Search contacts:**
   - Type in the search box
   - Results filter automatically as you type
   - Searches across name, phone, and email fields

## Deployment

### Deploy with Docker (Recommended)

**Requirements:**
- Docker
- Docker Compose

**Instructions:**

```bash
# Clone the repository
git clone https://github.com/l1n0n/se-toolkit-hackathon.git
cd se-toolkit-hackathon

# Build and run
docker-compose up --build -d

# Open in browser
# http://localhost:8000
```

### Deploy to VM (Ubuntu 24.04)

**Instructions:**

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Clone and deploy
git clone https://github.com/l1n0n/se-toolkit-hackathon.git
cd se-toolkit-hackathon
docker-compose up -d

# Access at http://your-vm-ip:8000
```

### Manage Application

```bash
# View logs
docker-compose logs

# Stop application
docker-compose down

# Restart application
docker-compose restart
```
