define({ "api": [
  {
    "type": "get",
    "url": "/api/turrone/v1/server/ping",
    "title": "Check server is running",
    "name": "GetPing",
    "group": "Server",
    "version": "0.1.0",
    "description": "<p>Before attempting to connect to any API endpoint of Turrone Server, it's best to make sure that the server is at least running.</p> <p>This simple ping test will make sure of that.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/api/turrone/v1/server/ping",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The &quot;pong&quot; to your &quot;ping&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"pong\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/turrone/v1/server/index.ts",
    "groupTitle": "Server",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/turrone/v1/server/ping"
      }
    ]
  },
  {
    "type": "get",
    "url": "/api/turrone/v1/server/status",
    "title": "Check server status",
    "name": "GetStatus",
    "group": "Server",
    "version": "0.1.0",
    "description": "<p>The server and its componenets can be in one of many states, depending on what has already happened.</p> <p>These states, along with what they represent, are:</p> <ul> <li><strong>error</strong>: There is currently an issue with this component</li> <li><strong>initializing</strong>: This component is currently starting</li> <li><strong>operational</strong>: The component is ready so serve requests</li> </ul> <p>The categories that are returned by each component are:</p> <ul> <li><strong>api</strong>: <ul> <li><strong>setup.config</strong>: There is no configuration file created to connect to the database</li> <li><strong>setup.user</strong>: There is no initial user created to log in and administer the server</li> </ul> </li> <li><strong>database</strong>: <ul> <li><strong>MongoNetworkError</strong>: There was an issue connecting to the database</li> <li><strong>MongoParseError</strong>: No hostname has been provided in the connection string</li> </ul> </li> </ul>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/api/turrone/v1/server/status",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "components",
            "description": "<p>The components making up the server</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "components.api",
            "description": "<p>The API endpoint component</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "components.api.status",
            "description": "<p>The current status of the component</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "components.api.message",
            "description": "<p>A message describing the reason for the current component status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "components.api.category",
            "description": "<p>The category of the message</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "components.api.updated",
            "description": "<p>A UNIX timestamp of when this component status was updated</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "components.database",
            "description": "<p>The database component</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "components.database.status",
            "description": "<p>The current status of the component</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "components.database.message",
            "description": "<p>A message describing the reason for the current component status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "components.database.category",
            "description": "<p>The category of the message</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "components.database.updated",
            "description": "<p>A UNIX timestamp of when this component status was updated</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"components\": {\n    \"api\": {\n      \"status\": \"operational\",\n      \"message\": \"\",\n      \"category\": \"\",\n      \"updated\": 1563624937\n    },\n    \"database\": {\n      \"status\": \"error\",\n      \"message\": \"failed to connect to server [127.0.0.1:27017] on first connect\",\n      \"category\": \"MongoNetworkError\",\n      \"updated\": 1565690565\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/turrone/v1/server/status.ts",
    "groupTitle": "Server",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/turrone/v1/server/status"
      }
    ]
  },
  {
    "type": "patch",
    "url": "/api/turrone/v1/server/config",
    "title": "Update the server configuration",
    "name": "PatchConfig",
    "group": "Server",
    "version": "0.1.0",
    "description": "<p>Updates the config file for the API to access the database, along with additional settings that should not be stored in the database (e.g. those that need to be available before the database has been connected to, or in case of database connection errors).</p> <p><strong>If an initial config file has not been created, this API endpoint route cannot be used. See <a href=\"#api-Server-PostConfig\">POST</a></strong></p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/api/turrone/v1/server/config -X PATCH -H \"Content-Type: application/json-patch+json\" -d '[{\"op\": \"replace\", \"path\": \"/dbConfig/host\", \"value\": \"NewDatabaseHost\"}]'",
        "type": "curl"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "defaultValue": "application/json-patch+json",
            "description": "<p>Used to detect that the received data is a JSON PATCH object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Content-Type\": \"application/json-patch+json\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": ".",
            "description": "<p>The container for one or more PATCH operations</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": ".op",
            "description": "<p>The operation to perform. <strong>Currently only <code>replace</code> is supported</strong></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": ".path",
            "description": "<p>A <a href=\"https://tools.ietf.org/html/rfc6901\">JSON pointer</a> to the value that is being modified</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": ".value",
            "description": "<p>The updated value to use. The values submitted must meet the requirements that are in the <a href=\"#api-Server-PostConfig\">POST</a> parameters, otherwise the request will be rejected</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "[\n  {\n    \"op\": \"replace\",\n    \"path\": \"/dbConfig/host\",\n    \"value\": \"NewDatabaseHost\"\n  },\n  {\n    \"op\": \"replace\",\n    \"path\": \"/dbConfig/port\",\n    \"value\": 27017\n  }\n]",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200 - OK": [
          {
            "group": "Success 200 - OK",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the request to update the server config</p>"
          },
          {
            "group": "Success 200 - OK",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The message returned from updating the server config</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response: Success 200 - OK",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"message\": \"Config file updated successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400 - Bad Request: Config exists": [
          {
            "group": "Error 400 - Bad Request: Config exists",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the request to update the server config</p>"
          },
          {
            "group": "Error 400 - Bad Request: Config exists",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The message returned from attempting to update the server config</p>"
          },
          {
            "group": "Error 400 - Bad Request: Config exists",
            "type": "String",
            "optional": false,
            "field": "see",
            "description": "<p>The alternative API endpoint to use to create the config file. See <a href=\"#api-Server-PostConfig\">POST</a></p>"
          }
        ],
        "Error 400 - Bad Request: Invalid PATCH data": [
          {
            "group": "Error 400 - Bad Request: Invalid PATCH data",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the request to update the server config</p>"
          },
          {
            "group": "Error 400 - Bad Request: Invalid PATCH data",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The message returned from attempting to update the server config</p>"
          },
          {
            "group": "Error 400 - Bad Request: Invalid PATCH data",
            "type": "Object",
            "optional": false,
            "field": "error",
            "description": "<p>The container for the error details</p>"
          },
          {
            "group": "Error 400 - Bad Request: Invalid PATCH data",
            "type": "String",
            "optional": false,
            "field": "error.details",
            "description": "<p>The details of the error, which needs to be corrected</p>"
          },
          {
            "group": "Error 400 - Bad Request: Invalid PATCH data",
            "type": "String",
            "optional": false,
            "field": "error.category",
            "description": "<p>The category of the error</p>"
          },
          {
            "group": "Error 400 - Bad Request: Invalid PATCH data",
            "type": "String",
            "optional": false,
            "field": "error.path",
            "description": "<p>The <a href=\"https://tools.ietf.org/html/rfc6901\">path</a> to the value that has the error</p>"
          }
        ],
        "Error 400 - Bad Request: Invalid request data": [
          {
            "group": "Error 400 - Bad Request: Invalid request data",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the request to update the server config</p>"
          },
          {
            "group": "Error 400 - Bad Request: Invalid request data",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The message returned from attempting to update the server config</p>"
          },
          {
            "group": "Error 400 - Bad Request: Invalid request data",
            "type": "Object",
            "optional": false,
            "field": "error",
            "description": "<p>The container for the error details</p>"
          },
          {
            "group": "Error 400 - Bad Request: Invalid request data",
            "type": "String",
            "optional": false,
            "field": "error.details",
            "description": "<p>The details of the error, which needs to be corrected</p>"
          },
          {
            "group": "Error 400 - Bad Request: Invalid request data",
            "type": "String",
            "optional": false,
            "field": "error.category",
            "description": "<p>The category of the error</p>"
          },
          {
            "group": "Error 400 - Bad Request: Invalid request data",
            "type": "String",
            "optional": false,
            "field": "error.path",
            "description": "<p>The <a href=\"https://tools.ietf.org/html/rfc6901\">path</a> to the value that has the error</p>"
          }
        ],
        "Error 500 - Internal Server Error": [
          {
            "group": "Error 500 - Internal Server Error",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the request to update the server config</p>"
          },
          {
            "group": "Error 500 - Internal Server Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The message returned from attempting to update the server config</p>"
          },
          {
            "group": "Error 500 - Internal Server Error",
            "type": "Object",
            "optional": false,
            "field": "error",
            "description": "<p>The container for the error details</p>"
          },
          {
            "group": "Error 500 - Internal Server Error",
            "type": "String",
            "optional": false,
            "field": "error.details",
            "description": "<p>The details of the error, which need to be corrected</p>"
          },
          {
            "group": "Error 500 - Internal Server Error",
            "type": "String",
            "optional": false,
            "field": "error.category",
            "description": "<p>The category of the error</p>"
          },
          {
            "group": "Error 500 - Internal Server Error",
            "type": "Number",
            "optional": false,
            "field": "error.errno",
            "description": "<p>The number of the error category</p>"
          },
          {
            "group": "Error 500 - Internal Server Error",
            "type": "String",
            "optional": false,
            "field": "error.path",
            "description": "<p>The attempted path to the config file</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response: Error 400 - Bad Request: Config exists",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"The config file does not exist\",\n  \"see\": \"POST http://localhost:8080/api/turrone/v1/server/config\"\n}",
          "type": "json"
        },
        {
          "title": "Response: Error 400 - Bad Request: Invalid PATCH data",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"Invalid PATCH data\",\n  \"error\": {\n    \"details\": \"\\\"value\\\" must be a string or \\\"value\\\" must be a number\",\n    \"category\": \"ValidationError\",\n    \"path\": \"/dbConfig/host\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Response: Error 400 - Bad Request: Invalid request data",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"Invalid request data\",\n  \"error\": {\n    \"details\": \"\\\"host\\\" must be a valid hostname\",\n    \"category\": \"ValidationError\",\n    \"path\": \"/dbConfig/host\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Response: Error 500 - Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"Unable to update config file\",\n  \"error\": {\n    \"details\": \"EPERM: operation not permitted, open '/path/to/config/file/local{-NODE_ENV}.json'\",\n    \"category\": \"EPERM\",\n    \"errno\": -4048,\n    \"path\": \"/path/to/config/file/local{-NODE_ENV}.json\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/turrone/v1/server/config.ts",
    "groupTitle": "Server",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/turrone/v1/server/config"
      }
    ]
  },
  {
    "type": "post",
    "url": "/api/turrone/v1/server/config",
    "title": "Create the server configuration",
    "name": "PostConfig",
    "group": "Server",
    "version": "0.1.0",
    "description": "<p>Creates the initial config file for the API to access the database, along with additional settings that should not be stored in the database (e.g. those that need to be available before the database has been connected to, or in case of database connection errors).</p> <p><strong>Once an initial config file has been created, this API endpoint route cannot be used again. See <a href=\"#api-Server-PatchConfig\">PATCH</a></strong></p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/api/turrone/v1/server/config -X POST -H \"Content-Type: application/json\" -d '{\"dbConfig\": {\"host\": \"127.0.0.1\", \"port\": 27017, \"database\": \"turrone\"}}'",
        "type": "curl"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "defaultValue": "application/json",
            "description": "<p>Used to detect that the received data is JSON</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Content-Type\": \"application/json\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "dbConfig",
            "description": "<p>The container for database settings</p>"
          }
        ],
        "dbConfig": [
          {
            "group": "dbConfig",
            "type": "String",
            "optional": false,
            "field": "host",
            "description": "<p>The hostname for the database server</p>"
          },
          {
            "group": "dbConfig",
            "type": "Number",
            "size": "1-65535",
            "optional": false,
            "field": "port",
            "description": "<p>The port that the database server is listening on</p>"
          },
          {
            "group": "dbConfig",
            "type": "String",
            "size": "1..63",
            "optional": false,
            "field": "database",
            "description": "<p>The database to connect to. Cannot contain <a href=\"https://docs.mongodb.com/manual/reference/limits/#Restrictions-on-Database-Names-for-Windows\"><code>\\/. &quot;$*&lt;&gt;:|?</code></a></p>"
          },
          {
            "group": "dbConfig",
            "type": "String",
            "optional": true,
            "field": "username",
            "description": "<p>The user account to use to connect to the database</p>"
          },
          {
            "group": "dbConfig",
            "type": "String",
            "optional": true,
            "field": "password",
            "description": "<p>The password for the user account</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"dbConfig\": {\n    \"host\": \"127.0.0.1\",\n    \"port\": 27017,\n    \"database\": \"turrone\",\n    \"username\": \"TurroneDatabaseUser\",\n    \"password\": \"My5up3rS3cur3P@ssw0rd!\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 201 - Created": [
          {
            "group": "Success 201 - Created",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the request to create the server config</p>"
          },
          {
            "group": "Success 201 - Created",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The message returned from creating the server config</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response: Success 201 - Created",
          "content": "HTTP/1.1 201 Created\n{\n  \"status\": \"success\",\n  \"message\": \"Config file created successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400 - Bad Request": [
          {
            "group": "Error 400 - Bad Request",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the request to create the server config</p>"
          },
          {
            "group": "Error 400 - Bad Request",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The message returned from creating the server config</p>"
          },
          {
            "group": "Error 400 - Bad Request",
            "type": "Object",
            "optional": false,
            "field": "error",
            "description": "<p>The container for the error details</p>"
          },
          {
            "group": "Error 400 - Bad Request",
            "type": "String",
            "optional": false,
            "field": "error.details",
            "description": "<p>The details of the error, which need to be corrected</p>"
          },
          {
            "group": "Error 400 - Bad Request",
            "type": "String",
            "optional": false,
            "field": "error.category",
            "description": "<p>The category of the error</p>"
          },
          {
            "group": "Error 400 - Bad Request",
            "type": "String",
            "optional": false,
            "field": "error.path",
            "description": "<p>The <a href=\"https://tools.ietf.org/html/rfc6901\">path</a> to the value that has the error</p>"
          }
        ],
        "Error 409 - Conflict": [
          {
            "group": "Error 409 - Conflict",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the request to create the server config</p>"
          },
          {
            "group": "Error 409 - Conflict",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The message returned from attempting to create the server config</p>"
          },
          {
            "group": "Error 409 - Conflict",
            "type": "String",
            "optional": false,
            "field": "see",
            "description": "<p>The alternative API endpoint to use to update the config file. See <a href=\"#api-Server-PatchConfig\">PATCH</a></p>"
          }
        ],
        "Error 500 - Internal Server Error": [
          {
            "group": "Error 500 - Internal Server Error",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the request to create the server config</p>"
          },
          {
            "group": "Error 500 - Internal Server Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The message returned from attempting to create the server config</p>"
          },
          {
            "group": "Error 500 - Internal Server Error",
            "type": "Object",
            "optional": false,
            "field": "error",
            "description": "<p>The container for the error details</p>"
          },
          {
            "group": "Error 500 - Internal Server Error",
            "type": "String",
            "optional": false,
            "field": "error.details",
            "description": "<p>The details of the error, which need to be corrected</p>"
          },
          {
            "group": "Error 500 - Internal Server Error",
            "type": "String",
            "optional": false,
            "field": "error.category",
            "description": "<p>The category of the error</p>"
          },
          {
            "group": "Error 500 - Internal Server Error",
            "type": "Number",
            "optional": false,
            "field": "error.errno",
            "description": "<p>The number of the error category</p>"
          },
          {
            "group": "Error 500 - Internal Server Error",
            "type": "String",
            "optional": false,
            "field": "error.path",
            "description": "<p>The attempted path to the config file</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response: Error 400 - Bad Request",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"Invalid request data\",\n  \"error\": {\n    \"details\": \"\\\"host\\\" must be a valid hostname\",\n    \"category\": \"ValidationError\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Response: Error 409 - Conflict",
          "content": "HTTP/1.1 409 Conflict\n{\n  \"status\": \"error\",\n  \"message\": \"The config file already exists\",\n  \"see\": \"PATCH http://localhost:8080/api/turrone/v1/server/config\"\n}",
          "type": "json"
        },
        {
          "title": "Response: Error 500 - Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"Unable to create config file\",\n  \"error\": {\n    \"details\": \"EPERM: operation not permitted, open '/path/to/config/file/local{-NODE_ENV}.json'\",\n    \"category\": \"EPERM\",\n    \"errno\": -4048,\n    \"path\": \"/path/to/config/file/local{-NODE_ENV}.json\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/turrone/v1/server/config.ts",
    "groupTitle": "Server",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/turrone/v1/server/config"
      }
    ]
  }
] });
