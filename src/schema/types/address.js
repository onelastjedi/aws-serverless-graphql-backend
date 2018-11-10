// GraphQL Language Cheat Sheet
// https://raw.githubusercontent.com/sogko/graphql-shorthand-notation-cheat-sheet/master/graphql-shorthand-notation-cheat-sheet.png
export default `
  type Address {
    street_number: String
    route: String
    locality: String
    administrative_area_level_1: String
    country: String
    postal_code: String
    line_2: String
    formatted_address: String
  }

  input AddressPayload {
    street_number: String
    route: String
    locality: String
    administrative_area_level_1: String
    country: String
    postal_code: String
    line_2: String
    formatted_address: String
  }
`