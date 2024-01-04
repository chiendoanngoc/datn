function getList() {
    return fetch('https://4wqlnxo1ld.execute-api.ap-southeast-1.amazonaws.com/create-scheduler').then(data => data.json())
}