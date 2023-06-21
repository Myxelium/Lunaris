const play = require('play-dl');

if (play.is_expired()) {
    await play.refreshToken()
}

play.getFreeClientID().then((clientID) => {
    play.setToken({
      soundcloud : {
          client_id : clientID
      }
    })

    console.log('Soudncloud Client ID: ' + clientID);
})

play.authorization();

