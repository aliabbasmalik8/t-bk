const catchErrors = (fn) => (request, response, next) => fn(request, response, next).catch((e) => {
  const message = e?.message ?? ['Internal Server Error'];

  if (e.response) {
    e.status = e.response.status;
  } else {
    e.status = 500;
  }

  return response.status(e.status).json({ errors: message });
});

const errorHandler = (err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).json({ msg: err.message });
};

module.exports = {
  catchErrors,
  errorHandler,
};
