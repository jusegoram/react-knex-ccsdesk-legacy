//CCS_UNIQUE O4JLZUE62CB
import Managers from './Manager/client'
import Techs from './Tech/client'
import Reference from './Reference/client'
import ErrorCodes from './ErrorCode/client'
import RoutelogDownload from './Routelog/client'
import User from './User/client'
import pageNotFound from '../client/pageNotFound'
import SDCR from './SDCR/client'

import Feature from './ClientFeature'

// pageNotFound needs to stay at the end
export default new Feature(RoutelogDownload, Techs, Managers, Reference, ErrorCodes, User, SDCR, pageNotFound)
