# ContactHub

A web-based phone book application for storing, searching, and managing personal contacts.

## Demo

![Screenshot placeholder - add after implementation](demo.png)

## Product Context

**End user:** All people who need to store and manage contacts in one place

**Problem:** Contacts are scattered across different services (phone, social media, messengers), making it difficult to find and manage them centrally

**Your solution:** A simple web application where users can quickly add new contacts and search existing ones.

## Features

### Implemented (Version 1)
- ✅ Add new contact
- ✅ Search existing contact

### Not Yet Implemented (Version 2)
- Contact categorization
- Export contacts (CSV)
- Improved UI/UX
- Docker deployment

## Usage

1. Open the application in your browser
2. To add a contact: fill in the name, phone, and email fields, then click "Add"
3. To search: type in the search box and results will filter automatically

## Deployment

### Option 1: Local Development

**OS:** Ubuntu 24.04 / Windows

**Requirements:**
- Python 3.10+
- pip

**Instructions:**

```bash
# Clone the repository
git clone <your-repo-url>
cd se-toolkit-hackathon

# Install dependencies
pip install -r requirements.txt

# Run the backend
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000

# Open frontend/index.html in browser
```

### Option 2: Docker (Recommended)

**Requirements:**
- Docker
- Docker Compose

**Instructions:**

```bash
# Clone the repository
git clone <your-repo-url>
cd se-toolkit-hackathon

# Build and run with Docker Compose
docker-compose up --build

# Open browser to http://localhost:8000
```

### Option 3: Deploy to VM

**OS:** Ubuntu 24.04

**Instructions:**

```bash
# Install Docker on VM
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Clone and deploy
git clone <your-repo-url>
cd se-toolkit-hackathon
docker-compose up -d

# Access at http://your-vm-ip:8000
```
