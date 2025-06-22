// This is where the main brain of the project goes.
// It will decide whether a new identity matches with an old one.
// For now, it just returns a dummy output.
import prisma from '../config/db.js';
import { formatResponse } from '../utils/formatResponse.js';


export const identifyService = async ({email, phoneNumbers}) => {
  // Finding all the matching email or phoneNumber contacts
 const matchedContacts = await prisma.contact.findMany ( {
  where :{
    OR: [
      email ? {email} : undefined,
      phoneNumbers ? {phoneNumbers} :undefined,
    ].filter(Boolean), // Filtering out Undefined if only one is provided --- invalid inputs
  },
  orderBy: {
    createdAt: 'asc', // oldest first
  },

 });


 // --> Scenario 2:: If no contacts found, create new PRIMARY user
 if(matchedContacts.length===0){
  const newContact = await prisma.contact.create({
    data:{
      email,
      phoneNumber,
      linkPrecedence:'PRIMARY',
    },
  });
return formatResponse(newContact,[]); 
 }


 // --> Scenario 3:: if contact exist--> but need to determine PRIMARY
 let primary = matchedContacts.find(c=> c.linkPrecedence==='PRIMARY') || matchedContacts[0];

 // --> Scenario 4:: if multiple PRIMARY found (exception)
//  You receive a request that matches both email and phoneNumber,
// BUT they exist in different contacts — and both of those are marked PRIMARY 
 const primaries = matchedContacts.filter(c=>c.linkPrecedence==='PRIMARY');
 if(primaries.length>1){
  const oldest = primaries[0];
  const Second = primaries[1];

  await prisma.contact.update({
    where:{id: Second.id},
    data:{
      linkPrecedence: 'SECONDARY',
      linkedID: oldest.id,
    }
  });

  primary = oldest;
 }

 //--> Scenario 5:: A contact already exists that matches either the email or phone number.
//BUT the other field is new, and hasn’t been stored yet. need to create new user

 const isNewEntryRequired = !matchedContacts.some(
  c=> c.email === email || c.phoneNumber === phoneNumbers
 );

 if(isNewEntryRequired){
  await prisma.contact.create({
    data:{
      email,
      phoneNumber,
      linkPrecedence:'SECONDARY',
      linkedID: primary.id,
    },
  });
 }

 //--> Scenario 6: "Find all contacts that are either the primary contact itself,
 //  or are linked to that primary contact as secondaries."
 const allLinked = await prisma.contact.findMany({
    where: {
      OR: [
        { id: primary.id },
        { linkedID: primary.id },
      ],
    },
  });

  return formatResponse(primary, allLinked);
};

//Helper function
function formatResponse(primary, allContacts) {
  const emails = new Set();
  const phones = new Set();
  const secondaryIds = [];

  for (const contact of allContacts) {
    if (contact.email) emails.add(contact.email);
    if (contact.phoneNumber) phones.add(contact.phoneNumber);
    if (contact.linkPrecedence === 'SECONDARY') secondaryIds.push(contact.id);
  }

  return {
    contact: {
      primaryContactId: primary.id,
      emails: Array.from(emails),
      phoneNumbers: Array.from(phones),
      secondaryContactIds: secondaryIds,
    },
  };
}


