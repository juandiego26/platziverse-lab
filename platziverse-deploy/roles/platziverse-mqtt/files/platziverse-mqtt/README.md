# platziverse-mqtt


## `agent/connected`

```js
{
  agent: {
    uuid, // autogenerate
    username, // Define by configuration
    name, // Define by configuration
    hostname, // Obtain of System Operating
    pid // Process identifier (PID) obtain of process
  }
}
```

## `agent/disconnected`

```js
{
  agent: {
    uuid
  }
}
```

## `agent/message`

```js
{
  agent,
  metrics: [
    {
      type,
      value
    }
  ],
  timestamp // Milliseconds generated when the message is created
}
```
