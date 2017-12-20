//CCS_UNIQUE KLSG877IMS
import Managers from './Manager/server'
import Techs from './Tech/server'
import Reference from './Reference/server'
import ErrorCodes from './ErrorCode/server'
import Routelog from './Routelog/server'
import User from './User/server'
import Pending from './Pending/server'
import util from './util/server'
import SDCR from './SDCR/server'

import Feature from './ServerFeature'

export default new Feature(Techs, Managers, Reference, ErrorCodes, Routelog, User, SDCR, Pending, util)
