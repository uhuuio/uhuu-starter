export const UserSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "User Information",
  "properties": {
    "company": {
      "type": "string",
      "title": "Company Name"
    },
    "first_name": {
      "type": "string",
      "title": "First Name"
    },
    "last_name": {
      "type": "string",
      "title": "Last Name"
    },
    "city": {
      "type": "string",
      "title": "City"
    },
    "street_address": {
      "type": "string",
      "title": "Street Address"
    },
    "postal_code": {
      "type": "string",
      "title": "Postal Code"
    }
  }
}