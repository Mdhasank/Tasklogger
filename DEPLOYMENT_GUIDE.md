# 🚀 TaskLogger Complete CI/CD Documentation
**Architecture:** Jenkins Master-Slave on Amazon Linux 2023 with Docker & Docker Compose.

---

## 🏗️ Phase 1: AWS Infrastructure (The Servers)

Create two EC2 instances with **Amazon Linux 2023**.

### 1.1 Jenkins Master (Management)
- **Role:** Orchestrates the builds, hosts the UI.
- **Security Group (Inbound):**
  - `SSH (22)`: Your IP.
  - `TCP (8080)`: Anywhere (Jenkins UI).

### 1.2 Application Slave (The Worker)
- **Role:** Runs Docker, performs builds, and hosts the application.
- **Security Group (Inbound):**
  - `SSH (22)`: The Master's Private IP.
  - `TCP (3000)`: Anywhere (Frontend access).
  - `TCP (5000)`: Anywhere (Backend API access).

---

## 🛠️ Phase 2: Installing Jenkins (Master Server)

Connect to the Master via SSH and run:

```bash
# 1. Install Java 17 and Git
sudo yum update -y
sudo yum install java-17-amazon-corretto-devel git -y

# 2. Add Jenkins Repository
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key

# 3. Install and Start Jenkins
sudo yum install jenkins -y
sudo systemctl enable jenkins
sudo systemctl start jenkins

# 4. Get Admin Password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

**Post-Install:**
1. Open `http://<MASTER_IP>:8080`.
2. Install **Suggested Plugins**.
3. Go to `Manage Jenkins` > `Plugins` > `Available` and install:
   - `Docker Pipeline`
   - `SSH Agent`
   - `GitHub Integration`

---

## 🤖 Phase 3: Configuring the Slave (Worker Server)

Connect to the Slave via SSH and run:

```bash
# 1. Install Java, Git & Docker
sudo yum update -y
sudo yum install java-17-amazon-corretto-devel git docker -y
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ec2-user

# 2. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. CRITICAL: Add Swap (Prevents Slave from going "Offline" during npm install)
sudo dd if=/dev/zero of=/swapfile bs=128M count=16
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
```
*Note: Logout and log back in for docker group changes to take effect.*

---

## 🔑 Phase 4: Slave-to-Master Connection (SSH)

1. **On Master:** 
   ```bash
   sudo su - jenkins
   ssh-keygen -t rsa # Hit Enter for all fields
   cat ~/.ssh/id_rsa.pub # COPY THIS OUTPUT
   ```
2. **On Slave:**
   ```bash
   echo "PASTE_THE_COPIED_KEY_HERE" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

---

## ⚙️ Phase 5: Jenkins UI Setup

### Step 5.1: Add Credentials
1. Go to `Manage Jenkins` > `Credentials` > `Global` > `Add Credentials`.
2. **Docker Hub:** Kind: `Username with password`. ID: `dockerhub-creds`.
3. **GitHub:** Kind: `Username with password`. ID: `github-creds` (Use your GitHub Token as password).

### Step 5.2: Create the Slave Node
1. `Manage Jenkins` > `Nodes` > `New Node`.
2. Name: `slave-node`. Type: `Permanent Agent`.
3. Remote Root: `/home/ec2-user/jenkins`.
4. Label: `docker-agent` (EXTREMELY IMPORTANT: Must match Jenkinsfile).
5. Launch Method: `Launch agents via SSH`.
   - Host: `<SLAVE_PRIVATE_IP>`.
   - Credentials: Add new `SSH Username with private key`. User: `ec2-user`. Key: Paste the **Private Key** from Master (`cat ~/.ssh/id_rsa`).
   - Host Key Verification: `Non verifying Verification Strategy`.

---

## 🚀 Phase 6: Creating the Pipeline Job

1. On Jenkins Dashboard, click **New Item**.
2. Name: `TaskLogger-Deployment`. Type: **Pipeline**. Click **OK**.
3. **Build Triggers:** Check `GitHub hook trigger for GITScm polling`.
4. **Pipeline Section:**
   - Definition: `Pipeline script from SCM`.
   - SCM: `Git`.
   - Repository URL: `https://github.com/your-username/Tasklogger.git`.
   - Credentials: Select `github-creds`.
   - Branch: `*/main`.
   - Script Path: `Jenkinsfile`.
5. Click **Save**.

---

## 🔄 Phase 7: GitHub Webhook Setup

1. Go to your GitHub Repository > **Settings** > **Webhooks**.
2. Click **Add webhook**.
3. **Payload URL:** `http://<MASTER_PUBLIC_IP>:8080/github-webhook/`.
4. **Content type:** `application/json`.
5. Click **Add webhook**.

---

## ✅ Phase 8: Verification
1. Push any change to your GitHub repo.
2. Jenkins will automatically start on the `slave-node`.
3. Once finished, access the app at:
   - **Frontend:** `http://<SLAVE_PUBLIC_IP>:3000`
   - **Backend API:** `http://<SLAVE_PUBLIC_IP>:5000/api/health`
