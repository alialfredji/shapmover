
Promise.all([
    require('./src/boot'),
])
    .catch((err) => {
        console.log('*** BOOT: Fatal Error');
        console.log(err);
    })