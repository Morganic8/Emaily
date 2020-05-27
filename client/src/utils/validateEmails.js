const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default (emails) => {
  const invalidEmails = emails
    .split(',')
    .map(email => email.trim())
    .filter(email => re.test(email) === false);


  const lastChar = emails.trim().slice(-1);

  if (invalidEmails.length && lastChar === ',') {
    return "Remove the very last comma"
  } else if (invalidEmails.length) {
    return `These emails are invalid: ${invalidEmails}`
  } else {
    return;
  }







}