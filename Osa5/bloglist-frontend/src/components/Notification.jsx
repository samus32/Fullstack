const Notification = ({ message, notificationType }) => {
  const successNotificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const errorNotificationStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  }

  if (notificationType === 'error') {
    return (
      <div className='error' style={errorNotificationStyle}>
        {message}
      </div>
    )
  }

  if (notificationType === 'success') {
    return (
      <div style={successNotificationStyle}>
        {message}
      </div>
    )
  }
}

export default Notification