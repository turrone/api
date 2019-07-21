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
  }
] });
