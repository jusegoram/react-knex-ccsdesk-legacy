//CCS_UNIQUE RESIQ8BQ13A
import { knex } from '../../database'

export default class Reference {
  static getAllEnums() {
    return knex.select().from('reference_enums')
  }
}
