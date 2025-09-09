function successResponse(res, data, message = "Success") {
  return res.status(200).json({ status: true, message, data });
}

function errorResponse(res, message, code = 400) {
  return res.status(code).json({ status: false, message });
}

module.exports = { successResponse, errorResponse };
