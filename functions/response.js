const { encrypt } = require("../encryption/aes");

function response({ req, error, ...props }) {
  if (req === undefined) {
    req = {};
  }

  props.status = props.status || req.statusCode || 404;

  const key = req?.key;

  const result = {
    method: req?.method,
    path: req?.path,
    status: props.status,
    action: props?.action?.replaceAll(" ", "-")?.toUpperCase(),
    error: error,
    debug: {
      params: req?.params,
      body: req?.body,
      cookies: req?.cookies,
      query: req?.query,
    },
  };

  if (error) {
    result.data = {
      title: props?.title || "Error: " + props.status,
      message: props?.message || req?.statusMessage,
    };
  } else {
    result.data = props.data;

    if (key) {
      result.data =
        encrypt(result.data, Buffer.from(key, "base64")) + "%" + key;
    }
  }

  const print = (res) => {
    res.status(props.status).json(result);
    res.end();
  };

  print.result = result;

  return print;
}

module.exports = response;
