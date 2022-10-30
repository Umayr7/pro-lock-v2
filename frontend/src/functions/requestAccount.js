export const requestAccount = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
};