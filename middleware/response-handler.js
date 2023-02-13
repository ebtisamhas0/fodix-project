module.exports.responseHandler = (data, res, message, status) => {
    let statusCode = status || 200;
    let messageData = message || `Success`;
    let auth = null
    if(data !== null){
        auth = data.Authorization;
    }
    if(auth !== null){
        res
        .cookie('Authorization', 'Bearer ' + data.Authorization, {
            httpOnly: true,
            sameSite: "strict",
            expires: new Date(Date.now() + 24 * 3600000
            ) // cookie will be removed after 24 hours
        })
        .status(statusCode).json({
            message: messageData,
            data: data,
        });
    }
    res
    .status(statusCode).json({
        message: messageData,
        data: data,
    });
};