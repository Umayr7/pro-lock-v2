# ProLock_Fyp
## Backend
### Step 1: Installation
```bash
npm install
```
### Step 2: Start
```bash
nodemon
```
## Blockchain
### Step 1: Setup
#### Open terminal:
```bash
npx hardhat node
```
#### List Of Accounts:<br><br>
![1](https://user-images.githubusercontent.com/67243313/168845667-0a74ece6-d8d1-46d1-a5bd-ed3fb76b8730.PNG)
#### Add LocalNetwork In Metamask:<br><br>
![4](https://user-images.githubusercontent.com/67243313/168853027-39bc8de7-4c86-41d4-8f3a-8ba47add0e24.PNG)
#### Import Account In Metamask:<br>
Enter your Account private key:<br><br>
![5](https://user-images.githubusercontent.com/67243313/168854571-c3d4e10c-3480-46dd-9091-3961ea496594.PNG)
### Step 2: Deployment
Open another terminal on the same directory
```bash
npx hardhat run --network localhost scripts/deploy.js
```
## Frontend
#### Open terminal:
```bash
npm start
```
