# EMS_backend

backend for EMS, using express mongo graphQL

# Auth

1- req header object must contain authorization.
2- after authentication, Bearer Token will be granted containing {
userid: user.userid,
name: user.name,
role: collection,
validity time.
}
3- this token should be included in every request header as bearer token, Auth middleware will verify it on every call.

Errors:{
msg: "request header should contain {role, authorization: Basic or Bearer Token} fields",
sol: check for role or credentials.

msg: "add role to the req header",
sol: role must be added to header when doing Basic Auth.

msg: "token error",
sol: remove current token form cookie, perform basic auth and save new token.

msg: "bad credentials",
sol: wrong credentials provided by the user.

msg: "bad credentials or db err",
sol: most probably it's a db error.

msg: "select role as: employee, owner or department",
sol: check for role added to header, must be one of mentioned.
}
