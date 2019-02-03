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
    "filename": "src/api/turrone/v1/server/index.js",
    "groupTitle": "Server",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/turrone/v1/server/ping"
      }
    ]
  }
] });
