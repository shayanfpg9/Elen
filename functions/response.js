function response({ req, error, ...props }) {
  if (req === undefined) {
    req = {};
  }

  props.status = props.status || req.statusCode || 404;

  const result = {
    method: req?.method,
    path: req?.path,
    status: props.status,
    action: props?.action?.replaceAll(" ", "-")?.toUpperCase(),
    error: error,
    debug: {
      params: req?.params,
      body: req?.body,
      query: req?.query,
      files: req?.files,
    },
  };

  if (error) {
    result.data = {
      title: props?.title || "Error: " + props.status,
      message: props?.message || req?.statusMessage,
    };
  } else {
    result.data = props.data;
  }

  const print = (res) => {
    res.status(props.status).json(result);
    res.end();
  };

  print.result = result;

  return print;
}

module.exports = response;
