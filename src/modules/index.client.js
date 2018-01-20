//CCS_UNIQUE O4JLZUE62CB
import Managers from './Manager/client'
import Techs from './Tech/client'
import Reference from './Reference/client'
import ErrorCodes from './ErrorCode/client'
import RoutelogDownload from './Routelog/client'
import User from './User/client'
import Pending from './Pending/client'
import pageNotFound from '../client/pageNotFound'
import SDCR from './SDCR/client'
import Routing from './Routing/client'

import Feature from './ClientFeature'

export default new Feature(
  RoutelogDownload,
  Techs,
  Managers,
  Reference,
  ErrorCodes,
  User,
  SDCR,
  Pending,
  Routing,
  pageNotFound
)
