'use strict'

const response = require('./../response')

exports.index = (req, res) => {
    response.status('HELLO REST API NODE JS', res)
}