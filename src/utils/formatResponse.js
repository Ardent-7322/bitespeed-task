export function formatResponse(primary, allContacts) {
  const emails = new Set();
  const phoneNumbers = new Set();
  const secondaryContactIds = [];

  for (const contact of allContacts) {
    if (contact.email) emails.add(contact.email);
    if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);
    if (contact.linkPrecedence === 'SECONDARY') {
      secondaryContactIds.push(contact.id);
    }
  }

  return {
    contact: {
      primaryContactId: primary.id,
      emails: Array.from(emails),
      phoneNumbers: Array.from(phoneNumbers),
      secondaryContactIds,
    },
  };
}
