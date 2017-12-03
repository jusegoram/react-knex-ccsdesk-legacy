//CCS_UNIQUE 2BO21ZPJ12U
import { knex } from '../../database'

export default class ErrorCode {
  static getAllErrorCodes() {
    return knex.select().from('error_codes')
  }
}
