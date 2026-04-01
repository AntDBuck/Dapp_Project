export const formatTime = ((timestamp) =>
{
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString();
});

export const formatAddress = ((address) =>
{
    const formattedAddress = address.slice(0, 5) + '...' + address.slice(-3);
    return formattedAddress;
});

export const generateId = () =>
{
    const datePart = Date.now().toString(); 
    const randomNumberPart = Math.floor(Math.random() * 1000000000).toString();
    const newId = (datePart + '-' + randomNumberPart);
    return newId;
};