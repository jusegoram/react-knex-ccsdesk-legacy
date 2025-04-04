//CCS_UNIQUE P1LEZ8M50YB
// Helpers
import { camelizeKeys } from 'humps'
import bcrypt from 'bcryptjs'
import { knex } from '../../database'

// Actual query fetching and transformation in DB
export default class User {
  async getUsers() {
    const queryBuilder = knex.select().from('user')
    return camelizeKeys(await queryBuilder)
  }

  async getUser(id) {
    return camelizeKeys(
      await knex
      .select()
      .from('user')
      .where({ id })
      .first()
    )
  }

  async getUserByEmail(email) {
    return camelizeKeys(
      await knex
      .select()
      .from('user')
      .where({ email })
      .first()
    )
  }
  static async addTechToTechsList({ cid, userId }) {
    await knex('user')
    .update('techs', knex.raw("techs || '[??]'::jsonb", [cid]))
    .where({ id: userId })
    .whereRaw("NOT techs @> '??'", [cid])
    const user = camelizeKeys(
      await knex
      .select()
      .from('user')
      .where({ id: userId })
      .first()
    )
    return user
  }
  static async removeTechFromTechsList({ cid, userId }) {
    const user = camelizeKeys(
      await knex('user')
      .update('techs', knex.raw('techs - ?', [cid]))
      .where({ id: userId })
      .returning('*')
      .get(0)
    )
    return user
  }

  async getUserByTechId(tech_id) {
    return camelizeKeys(
      await knex
      .select()
      .from('user')
      .where({ tech_id })
      .first()
    )
  }

  async register(user) {
    const passwordHashed = await bcrypt.hash(user.password, 12)
    return camelizeKeys(
      await knex('user')
      .insert({ ...user, password: passwordHashed })
      .returning('*')
      .get(0)
    )
  }

  async setCompany({ id, company }) {
    const update = { company: company }
    if (company == 'Goodman' || company == 'DirectSat') {
      update.hsp = company
    }
    return await knex('user')
    .where({ id })
    .update(update)
  }

  async editUser({ id, username, email, isAdmin, isActive, password }) {
    const userPromise = knex('user')
    .update({
      username: username,
      is_admin: isAdmin,
      is_active: isActive,
    })
    .where({ id })

    let localAuthInput = { email }
    if (password) {
      const passwordHashed = await bcrypt.hash(password, 12)
      localAuthInput = { email, password: passwordHashed }
    }

    const localAuth = knex('auth_local')
    .update({ ...localAuthInput })
    .where({ user_id: id })

    return Promise.all([userPromise, localAuth])
  }

  deleteUser(id) {
    return knex('user')
    .where('id', '=', id)
    .del()
  }

  async setPassword(email, password) {
    const passwordHashed = await bcrypt.hash(password, 12)
    await knex('user')
    .update({ password: passwordHashed })
    .where({ email })
  }
}
